import React from 'react';
import { Header, Jumbotron } from 'watson-react-components';

// eslint-disable-next-line
const DESCRIPTION = 'Use the Tone Analyzer for Customer Engagement endpoint to monitor customer support conversations.  Escalate customer conversations when they turn sour, or find opportunities to improve customer service scripts, dialogs and customer journeys. Tones detected with this endpoint include frustrated, sad, satisfied, excited, polite, impolite and sympathetic.';

function Layout(props) {
  return (
    <html lang="en">
      <head>
        <title>Tone Analyzer for Customer Engagement</title>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="og:title" content="Tone Analyzer for Customer Engagement Demo" />
        <meta name="og:description" content={DESCRIPTION} />
        <link rel="icon" type="image/png" sizes="32x32" href="/images/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="96x96" href="/images/favicon-96x96.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/images/favicon-16x16.png" />
        <link rel="icon" type="image/x-icon" href="/images/favicon.ico" />
        <link rel="stylesheet" href="/css/watson-react-components.min.css" />
        <link rel="stylesheet" href="/css/style.css" />
      </head>
      <body>
        <Header
          mainBreadcrumbs="Tone Analyzer"
          mainBreadcrumbsUrl="http://www.ibm.com/watson/developercloud/tone-analyzer.html"
        />
        <Jumbotron
          serviceName="Tone Analyzer for Customer Engagement"
          repository="https://github.com/watson-developer-cloud/customer-engagement-nodejs"
          documentation="https://console.bluemix.net/docs/services/tone-analyzer/index.html"
          apiReference="https://www.ibm.com/watson/developercloud/tone-analyzer/api/v3/#customer-tone"
          version="GA"
          serviceIcon="/images/service-icon.png"
          startInBluemix="https://console.ng.bluemix.net/registration/?target=/catalog/services/tone-analyzer/"
          description={DESCRIPTION}
        />
        <div id="root" className="root _container_medium">
          {props.children}
        </div>
        <script type="text/javascript" src="js/bundle.js" />
        <script type="text/javascript" src="js/ga.js" />
      </body>
    </html>
  );
}

Layout.propTypes = {
  //eslint-disable-next-line
  children: React.PropTypes.object.isRequired,
};

export default Layout;
