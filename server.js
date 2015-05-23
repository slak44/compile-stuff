'use strict';
Array.prototype.last = function () {return this[this.length - 1]};
const fs = require('fs');
const cp = require('child_process');
const entities = new (require('html-entities').AllHtmlEntities)();
let server;
let fails = 0;
runServer();

function runServer() {
  try {
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
    server.listen(8192, function () {
      console.log('Server online.');
    });
  } catch (e) {
    console.log(e.message);
    fails++;
    if (fails >= 30) return;
    runServer();
  }
}

function listener(request, response) {
  let url = require('url').parse(request.url);
  switch (request.method) {
    case 'GET':
      processGET(request, response, url);
      break;
    case 'POST':
      processPOST(request, response, url);
      break;
    default: sendError(response, 400, `Bad request: method not supported (${request.method}).`);
  }
}

function processPOST(request, response, url) {
  let body = '';
  request.setEncoding('utf8');
  request.on('data', function (e) {body += e});
  request.on('end', function () {
    body = entities.decode(body.replace(/\t/g, '\n'));
    execute(url.pathname.slice(1), body, function (error, stdout, stderr) {
      if (error) {
        console.error(`Code encountered an error: ${error.message}`);
        sendError(response, 400, `Could not execute code: ${error.message}`);
      } else {
        response.writeHead(200, {
          'Cache-Control': 'max-age=0',
          'Access-Control-Allow-Origin': '109.103.29.52',
          'Content-Type': 'text/plain',
          'Server': 'Slak\'s Server'
        });
        response.write(stdout);
        response.end();
      }
    });
  });
}

function processGET(request, response, url) {
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

function execute(lang, code, output) {
  let fileName = `${Math.random()}.${lang.slice(5)}`;
  if (lang === 'lang-java') fileName = `${code.match(/class(.*?){/).last().trim()}.java`; // Because java's a special snowflake and hates misnamed files
  fs.writeFile(fileName, code.trim(), function (err) {
    if (err) throw err;
    cp.exec(`iojs -harmony ./execute/${lang}.js "${fileName}"`, function (err, stdout, stderr) {
      fs.unlink(fileName);
      output(err, stdout, stderr);
    });
  });
}