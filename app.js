/**
 * Copyright 2015 IBM Corp. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* eslint-env es6 */
require('dotenv').config({ silent: true });

const express = require('express');

const app = express();

// Bootstrap application settings
require('./config/express')(app);

// Instantiate Tone Analyzer service
const ToneAnalyzerV3 = require('ibm-watson/tone-analyzer/v3');
const { IamAuthenticator } = require('ibm-watson/auth');

const toneAnalyzer = new ToneAnalyzerV3({
  version: '2019-10-10',
  authenticator: new IamAuthenticator({
    apikey: process.env.TONE_ANALYZER_IAM_APIKEY || 'type-key-here',
  }),
  url: process.env.TONE_ANALYZER_URL,
});

// Endpoint for web app
app.get('/', (req, res) => {
  res.render('index');
});

// Endpoint for Tone Analyzer tone_chat endpoint
app.post('/api/tone_chat', async (req, res, next) => {
  const params = {
    utterances: req.body.utterances,
    contentLanguage: req.body.content_language
  };
  try {
    const tone = await toneAnalyzer.toneChat(params);
    return res.json(tone.result);
  } catch(e) {
    next(e);
  }
});

// Endpoint for healthcheck for Tone Analyzer's tone_chat endpoint
app.get('/healthcheck', async (req, res) => {
  const start = new Date();
  const payload = { utterances: [{ text: 'sad', user: 'customer' }] };

  try {
    const tone = await toneAnalyzer.toneChat(payload);
    return res.json({
      status: 'normal',
      response_time: new Date() - start
    });
  } catch(error) {
    return res.status(502).json({ status: 'down', error, response_time: new Date() - start });
  }
});

// User feedback module
require('./user-feedback')(app);

// error-handler settings
require('./config/error-handler')(app);

module.exports = app;
