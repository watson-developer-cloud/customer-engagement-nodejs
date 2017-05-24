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

module.exports = function (app) {
  // Endpoint to log user feedback on perceived accuracy of a customer tone
  // predicted by Tone Analyzer tone_chat
  app.post('/log_perceived_accuracy', (req, res) => {
    const cloudant = new Cloudant({
      account: process.env.CLOUDANT_USERNAME,
      password: process.env.CLOUDANT_PASSWORD,
      plugin: 'promises',
    });
    const tonesAccuracyDb = cloudant.db.use(process.env.PERCEIVED_ACCURACY_DB);

    const tonesAccuracyLogEntry = req.body;
    tonesAccuracyLogEntry.timestamp = (new Date(Date.now())).toISOString();
    tonesAccuracyLogEntry.ip = req.ip;

    tonesAccuracyDb.insert(tonesAccuracyLogEntry, (err, body) => {
      if (err) {
        return res.status(400).send({ message: '[db.insert]: '.concat(err.message) });
      }
      // console.log(body);
      return res.json(body);
    });
  });
};
