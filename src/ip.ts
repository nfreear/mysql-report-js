/**
 * Display your IP address.
 *
 * @author NDF, 01-Oct-2020.
 * @see    https://stackoverflow.com/questions/3653065/get-local-ip-address-in-node-js#8440736
 * @see    http://www.csgnetwork.com/ipinfocalc.html
 */

import { networkInterfaces } from 'os';
// const { networkInterfaces } = require('os');

displayIpAddress();

function displayIpAddress () {
  const nets = networkInterfaces();
  const results = Object.create(null); // or just '{}', an empty object

  for (const name of Object.keys(nets)) {
      for (const net of nets[name]) {
          // skip over non-ipv4 and internal (i.e. 127.0.0.1) addresses
          if (net.family === 'IPv4' && !net.internal) {
              if (!results[name]) {
                  results[name] = [];
              }

              results[name].push(net.address);
          }
      }
  }

  console.log('IP addresses:', results);

  return results;
}
