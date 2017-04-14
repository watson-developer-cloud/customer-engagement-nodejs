
/* eslint no-undef: 0 */
/* eslint prefer-arrow-callback: 0 */
casper.test.begin('Customer Engagement Demo', 14, function suite(test) {
  const baseHost = 'http://localhost:3000';

  /**
  * Test to ensure the components that the user can interact with are found - Input
  */
  function testReplyInputExists() {
    test.assertExists('div.input_area', 'Reply input box is found');
    test.assertExists('div.submit_button', 'Reply button is found');
  }

  /*
  function testSampleQuestionClick() {
    casper.then(function (response) {
      this.click('div.sample-questions--left li:nth-child(1)');
      casper.waitForSelector('div.output-container', function () {
        test.assertExists('h2.base--h2', 'Output section was created');
        casper.test.assertSelectorHasText('h2.base--h2', 'Ask a question about the weather');
      });
      test.assert(response.status === 200, 'Sample question submitted sucessfully');
    });
  }

  function testEnterQuestion() {
    // Enter a question
    casper.then(function () {
      this.sendKeys('input.base--input.question-input--input', 'Is the weather outside frightful?');
      this.sendKeys('input.base--input.question-input--input', casper.page.event.key.Enter);
    });
    casper.waitForSelector('div.output-container', function () {
      test.assertExists('h2.base--h2', 'Output section was created');
    });
  }

  function testEnterQuestionASK() {
    // Enter a question
    casper.then(function () {
      this.sendKeys('input.base--input.question-input--input', 'Is the weather outside frightful?');
      casper.then(function () { this.click('div.question-input--button-container'); });
    });
    casper.waitForSelector('div.output-container', function () {
      test.assertExists('h2.base--h2', 'Output section was created');
    });
  }
  */

  function checkLinkDest(selectorToClick) {
    casper.then(function () {
      this.click(selectorToClick);
      test.assertHttpStatus(200);
    });
  }

  function testHeaderLinks() {
    checkLinkDest('div.header--wordmark');
    checkLinkDest('div.header--breadcrumbs');

    checkLinkDest('nav.jumbotron--nav li:nth-child(1)');
    checkLinkDest('nav.jumbotron--nav li:nth-child(2)');
    checkLinkDest('nav.jumbotron--nav li:nth-child(3)');
  }

  casper.start(baseHost, function () {
    casper.test.comment('Starting Testing');
    test.assertHttpStatus(200, 'Customer Engagement demo is up');
    test.assertTitle('Tone Analyzer for Customer Engagement', 'Title is correct');

    testHeaderLinks();
    testReplyInputExists();
    // ßtestSampleQuestionClick();
    // testEnterQuestion();
    // testEnterQuestionASK();
  });

  casper.run(function () {
    test.done();
  });
});
