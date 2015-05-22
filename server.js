'use strict';
const fs = require('fs');
let server;
if (process.argv[2] === 'use-https') {
  const https = require('https');
  let options = {
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem')
  };
  server = https.createServer(options, listener);
} else {
  const http = require('http');
  server = http.createServer(listener);
}

function listener(request, response) {
  switch (request.method) {
    case 'GET':
      processGET(request, response);
      break;
    case 'POST':
      sendError(response, 501, 'POST not allowed yet.');
      break;
    default: sendError(response, 400, `Bad request: method not supported (${request.method}).`);
  }
}
server.listen(8192, function () {
  console.log('Server online.');
});

function processGET(request, response) {
  let url = require('url').parse(request.url);
  switch (url.pathname) {
    case '/':
      sendFile(response, 'index/main.html', 'document');
      break;
    case '/highlight/obsidian.css':
    case '/main.css':
      sendFile(response, `index${url.pathname}`, 'text/css');
      break;
    case '/highlight/highlight.pack.js':
    case '/script.js':
      sendFile(response, `index${url.pathname}`, 'text/javascript');
      break;
    default: sendError(response, 404, 'Not found.');
  }
}

function sendFile(response, filePath, mimeType) {
  if (!filePath) throw new Error('Path not specified.');
  if (!mimeType) mimeType = 'text/plain';
  fs.readFile(filePath, {encoding: 'utf-8'}, function (err, data) {
    if (err) sendError(response, 500, `Internal server error: could not find ${filePath}`);
    else {
      response.writeHead(200, {
        'Cache-Control': 'max-age=3600',
        'Access-Control-Allow-Origin': '109.103.29.52',
        'Content-Type': mimeType,
        'Server': 'Slak\'s Server'
      });
      response.write(data);
      response.end();
    }
  });
}

function sendError(response, code, msg) {
  response.writeHead(code, msg, {
    'Access-Control-Allow-Origin': '109.103.29.52',
    'Connection': 'close',
    'Content-Type': 'text/html',
    'Server': 'Slak\'s Server'
  });
  response.write(
    `<html>
      <head><title>${code}</title><head>
      <body>
        <h1>${code}: ${msg}</h1>
      </body>
    </html>`
  );
  response.end();
}