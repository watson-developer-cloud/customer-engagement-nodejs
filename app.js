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
const ToneAnalyzerV3 = require('watson-developer-cloud/tone-analyzer/v3');
const toneAnalyzer = new ToneAnalyzerV3({
  version_date: '2016-05-19',
});

// Endpoint for web app
app.get('/', (req, res) => {
  res.render('index');
});

// Endpoint for Tone Analyzer tone_chat endpoint
app.post('/api/tone_chat', (req, res, next) => {
  toneAnalyzer.tone_chat(req.body, (err, tone) => {
    if (err) {
      return next(err);
    }
    return res.json(tone);
  });
});

// Endpoint for healthcheck for Tone Analyzer's tone_chat endpoint
app.get('/healthcheck', (req, res) => {
  const start = new Date();
  const payload = { utterances: [{ text: 'sad', user: 'customer' }] };

  toneAnalyzer.tone_chat(payload, (err) => {
    const response = {
      status: 'normal',
      response_time: (new Date() - start),
    };

    if (err) {
      Object.assign(response, { status: 'down', error: err });
      return res.status(502).json(response);
    }
    return res.json(response);
  });
});

// User feedback module
require('./user-feedback')(app);

// error-handler settings
require('./config/error-handler')(app);

module.exports = app;
