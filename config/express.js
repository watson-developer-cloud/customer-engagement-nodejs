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


// Module dependencies
const express = require('express');
const bodyParser = require('body-parser');
const expressBrowserify = require('express-browserify');
const path = require('path');
const morgan = require('morgan');

module.exports = function (app) {
  app.enable('trust proxy');
  app.use(require('express-status-monitor')());
  app.set('view engine', 'jsx');
  app.engine('jsx', require('express-react-views').createEngine());

  // Endpoint test for call to tone-analyzer
  // if an error is returned from a request to the tone-analyzer tone_chat endpoint,
  // return a 502, otherwise return a 200.
  app.get('/healthcheck', (req, res) => {
    const ToneAnalyzerV3 = require('watson-developer-cloud/tone-analyzer/v3');
    const toneAnalyzer = new ToneAnalyzerV3({
      // If unspecified here, the TONE_ANALYZER_USERNAME and
      // TONE_ANALYZER_PASSWORD env properties will be checked
      // After that, the SDK will fall back to the bluemix-provided VCAP_SERVICES environment property
      // username: '<username>',
      // password: '<password>',
      url: 'https://gateway.watsonplatform.net/tone-analyzer/api',
      version_date: '2016-05-19',
      headers: {
        'X-Watson-Learning-Opt-Out': true,
      },
    });

    const requestTimestamp = new Date().toISOString();
    const requestPayload = {
      utterances: [{ text: 'sad', user: 'customer' }],
    };

    toneAnalyzer.tone_chat(requestPayload, (err, tone) => {
      const responseTimestamp = new Date().toISOString();

      if (err) {
        return res
        .status(502)
        .json({
          logs: [
            {
              request: requestPayload,
              request_timestamp: requestTimestamp,
              response: err.toString(),
              response_timestamp: responseTimestamp,
            },
          ],
        });
      }
      return res
        .status(200)
        .json({
          logs: [
            {
              request: requestPayload,
              request_timestamp: requestTimestamp,
              response: tone,
              response_timestamp: responseTimestamp,
            },
          ],
        });
    });
  });


  // Only loaded when running in Bluemix
  if (process.env.VCAP_APPLICATION) {
    require('./security')(app);
  }

  // automatically bundle the front-end js on the fly
  // note: this should come before the express.static since bundle.js is in the public folder
  const isDev = (app.get('env') === 'development');
  const browserifyier = expressBrowserify('./public/js/bundle.jsx', {
    watch: isDev,
    debug: isDev,
    extension: ['jsx'],
    transform: ['babelify'],
  });
  if (!isDev) {
    browserifyier.browserify.transform('uglifyify', { global: true });
  }
  app.get('/js/bundle.js', browserifyier);

  // Configure Express
  app.use(bodyParser.json({ limit: '1mb' }));
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(express.static(path.join(__dirname, '..', 'public')));
  app.use(express.static(path.join(__dirname, '..', 'node_modules/watson-react-components/dist/')));
  app.use(morgan('dev'));
};
