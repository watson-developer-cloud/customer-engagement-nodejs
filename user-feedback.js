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

// Instantiate cloudant db for storing user feedback
const Cloudant = require('cloudant');

const PERCEIVED_ACCURACY_ENDPOINT = '/log_perceived_accuracy';
const ALTERNATIVE_CUSTOMER_TONES_ENDPOINT = '/log_alternative_customer_tones';

// Endpoint to log user feedback on perceived accuracy of a customer tone
// predicted by Tone Analyzer tone_chat
module.exports = function (app) {
  if (process.env.CLOUDANT_USERNAME && process.env.CLOUDANT_PASSWORD) {
    const cloudant = new Cloudant({
      account: process.env.CLOUDANT_USERNAME,
      password: process.env.CLOUDANT_PASSWORD,
      plugin: 'promises',
    });
    const accuracyDb = cloudant.db.use(process.env.PERCEIVED_ACCURACY_DB);
    const altTonesDb = cloudant.db.use(process.env.ALTERNATIVE_CUSTOMER_TONES_DB);

    app.post(PERCEIVED_ACCURACY_ENDPOINT, (req, res, next) => {
      const feedback = req.body;
      feedback.timestamp = (new Date(Date.now())).toISOString();
      feedback.ip = req.ip;

      accuracyDb.insert(feedback, (err) => {
        if (err) {
          return next(err);
        }
        return res.json({});
      });
    });

    app.post(ALTERNATIVE_CUSTOMER_TONES_ENDPOINT, (req, res, next) => {
      const feedback = req.body;
      feedback.timestamp = (new Date(Date.now())).toISOString();
      feedback.ip = req.ip;

      altTonesDb.insert(feedback, (err) => {
        if (err) {
          return next(err);
        }
        return res.json({});
      });
    });
  } else {
    app.post(PERCEIVED_ACCURACY_ENDPOINT, (req, res) => {
      console.log('Feedback from user:', req.body); // eslint-disable-line no-console
      res.json({});
    });

    app.post(ALTERNATIVE_CUSTOMER_TONES_ENDPOINT, (req, res) => {
      console.log('Feedback from user:', req.body); // eslint-disable-line no-console
      res.json({});
    });

    console.log('Using the console to print feedback'); // eslint-disable-line no-console
  }
};
