'use strict';
const http = require('http');
const fs = require('fs');
const server = http.createServer(listener);
function listener(request, response) {
  switch (request.method) {
    case 'GET':
      processGET(request, response);
      break;
    case 'POST':
      sendError(response, 405, 'POST not allowed.');
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
    case '/main.css':
      sendFile(response, 'index/main.css', 'text/css');
      break;
    default: sendError(response, 404, 'Not found.');
  }
}

function sendFile(response, filePath, mimeType) {
  if (!filePath) throw new Error('Path not specified.');
  if (!mimeType) mimeType = 'text/plain';
  fs.readFile(filePath, {encoding: 'utf-8'}, function (err, data) {
    if (err) sendError(response, 503, `Internal server error: could not find ${filePath}`);
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