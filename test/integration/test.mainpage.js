
/* eslint no-undef: 0 */
/* eslint prefer-arrow-callback: 0 */
casper.test.begin('Customer Engagement Demo', 7, function suite(test) {
  const baseHost = 'http://localhost:3000';

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
  });

  casper.run(function () {
    test.done();
  });
});
