const cache = require('memory-cache');
const dns = require('native-dns');
const http = require('http');
const url = require('url');
const utils = require('./utils');

exports.run = (localIp) => {

  // run api server
  http.createServer((request, response) => {
    const callback = url.parse(request.url, true).query.callback;
    const host = request.headers.host.split(':')[0];
    const clientIp = utils.getClientIp(request);
    const ldnsIp = cache.get(host);
    console.log('http request: ', {domain: host, clientIp, ldnsIp});

    response.end(`${callback}(${JSON.stringify({clientIp, ldnsIp})})`);
  }).listen({host: localIp, port: 8053});
  
  // run dns server
  const defaultTtl = 600; // unit s
  const expired = defaultTtl * 1000; // unit ms
  dns.createServer().on('request', (request, response) => {
    const ldnsIp = request.address.address;
    const name = request.question[0].name;
    console.log('dns request: ', {domain: name, ldnsIp});

    cache.put(name, ldnsIp, expired);
    response.answer.push(dns.A({address: localIp, ttl: defaultTtl, name}));
    response.send();
  }).serve({host: localIp, port: 53});
};
