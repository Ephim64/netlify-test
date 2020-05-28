const express = require('express');
const serverless = require('serverless-http');

const app = express();
const router = express.Router();

const rootPrefix = '/.netlify/functions/api';
const siteUrl = 'jovial-tesla-bba62a.netlify.app'

let query = null;
let srcUrl = null;

router.get('/', (req, res) => {
  res.json({hello: 'hi'});
});

router.get('/start', (req, res) => {
  query = '?' + Object.keys(req.query).map(key => `${key}=${req.query[key]}`).join('&');
  srcUrl = req.protocol + '://' + siteUrl + req.originalUrl;

  res.redirect(`${rootPrefix}/end`);
});

router.get('/end', (req, res) => {
  const htmlString = `
  <!DOCTYPE html>
  <html>
    <head>
      <meta property="og:title" content="Title ${query}" />
      <meta property="og:url" content="${srcUrl}" />
      <meta property="og:description" content="You came with this query: ${query}" />
      <meta property="og:title" content="Title" />
      <title>Test site</title>
      <meta
    </head>
    <body>
      <h1>Query?</h1>
      <div>Here: ${query}</div>
      <div>Full url: ${srcUrl}</div>
    </body>
  </html>
  `;

  res.set('Content-Type', 'text/html');
  res.send(htmlString);
})

app.use(rootPrefix, router);

module.exports.handler = serverless(app);