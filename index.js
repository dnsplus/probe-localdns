const http = require('http');
const Inliner = require('inliner');
const server = require('./src/server');

const domain = process.argv[2] || 'localhost';
const localIp = process.argv[3] || "127.0.0.1";
new Inliner('./index.html', (error, html) => {
  // run probe sever
  server.run(localIp);

  // replace domain
  html = html.replace('<domain>', domain);

  // run http server
  http.createServer((request, response) => response.end(html)).listen({host: localIp, port: 80});
})