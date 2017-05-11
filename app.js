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
  url: 'https://gateway.watsonplatform.net/tone-analyzer/api',
  version_date: '2016-05-19',
});

// Instantiate Cloudant service
const Cloudant = require('cloudant');
const cloudant = new Cloudant({
  account: process.env.CLOUDANT_USERNAME,
  password: process.env.CLOUDANT_PASSWORD,
  plugin: 'promises',
});
const tonesAccuracyDb = cloudant.db.use('customer-tones-accuracy');

// Endpoint for web app
app.get('/', (req, res) => {
  res.render('index');
});

// Endpoint for call to Tone Analyzer tone_chat endpoint
app.post('/api/tone_chat', (req, res, next) => {
  toneAnalyzer.tone_chat(req.body, (err, tone) => {
    if (err) {
      return next(err);
    }
    return res.json(tone);
  });
});

// Endpoint to insert logging data for the data collection feature
// to collect perceived accuracy of customer tones
app.get('/log/customer_tones_accuracy', (req, res) => {
  console.log('customer_tones_accuracy endpoint called');
  console.log(`data is ${JSON.stringify(req.body, 2, null)}`);

  const tonesAccuracyLogEntry = {
    user_feedback: 'test',
    tone_analyzer_response: 'test',
    timestamp: (new Date(Date.now())).toISOString(),
    ip: req.ip,
  };

  tonesAccuracyDb.insert(tonesAccuracyLogEntry, (err, body) => {
    if (err) {
      return console.log('[db.insert] ', err.message);
    }
    console.log(body);
    res.send(body);
  });
});

// Endpoint to run healthcheck for call to the Tone Analyzer service
// If an error is returned from a request to the Tone Analyzer service tone_chat
// endpoint, return a 502, otherwise return a 200.
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

// error-handler settings
require('./config/error-handler')(app);

module.exports = app;
