/**
 *
 * @author Nick Freear, 25-August-2020.
 */

import * as Dotenv from 'dotenv';
import mysqldump, * as Mysqldump from 'mysqldump';
// or const mysqldump = require('mysqldump')
import { readFileSync } from 'fs';

Dotenv.config();

const {
  DbHost, DbPort, DbUser, DbPassword, Database, DbSsl, DbTables, Compress, DumpPath, CaPath
} = process.env;

const DUMP_PATH = DumpPath || './dump.sql';

const CONFIG: Mysqldump.Options = {
    connection: {
        host: DbHost || 'localhost',
        port: parseInt(DbPort, 10) || 3306,
        user: DbUser || 'root',
        password: DbPassword || '123456',
        database: Database || 'my_database',

        ssl: DbSsl ? {
          ca: readFileSync(CaPath, 'utf8') // join(__dirname, '..', 'BaxxxCyberTrustRoot.crt.pem'))
        }
        : null,
    },

    dump: {
      tables: DbTables ? DbTables.split(',') : [ ],
    },

    dumpToFile: Compress ? `${DUMP_PATH}.gz` : DUMP_PATH,
    compressFile: !!Compress,
};

(async (options: Mysqldump.Options) => {
  console.warn('Options:', options);

  let result: Mysqldump.DumpReturn;

  try {
    result = await mysqldump(options);
  } catch (error) {
    console.error('Database ERROR.');
    console.error(error);
  }

  if (result) {
    console.warn('OK. Database dump complete ?');

    // ...?
  }
})(CONFIG);

/*

# ERRORS

Error: Client with IP address 'N.N.N.N' is not allowed to connect to this MySQL server.
  errno: 9000,
  sqlState: 'HY000'

Error: connect ETIMEDOUT.

Error: Unknown or unexpected option: -o
  code: 'ARG_UNKNOWN_OPTION'

---
events.js:291
      throw er; // Unhandled 'error' event
      ^

Error: read ECONNRESET
    at TLSWrap.onStreamRead (internal/stream_base_commons.js:207:27)
Emitted 'error' event on Connection instance at:
    at Connection._notifyError (/Users/XXX/admins-report/node_modules/mysql2/lib/connection.js:221:12)
    at Connection._handleFatalError (/Users/XXX/admins-report/node_modules/mysql2/lib/connection.js:156:10)
    at Connection._handleNetworkError (/Users/XXX/admins-report/node_modules/mysql2/lib/connection.js:169:10)
    at TLSSocket.<anonymous> (/Users/XXX/admins-report/node_modules/mysql2/lib/connection.js:327:14)
    at TLSSocket.emit (events.js:314:20)
    at TLSSocket._tlsError (_tls_wrap.js:893:8)
    at TLSSocket.emit (events.js:314:20)
    at emitErrorNT (internal/streams/destroy.js:100:8)
    at emitErrorCloseNT (internal/streams/destroy.js:68:3)
    at processTicksAndRejections (internal/process/task_queues.js:80:21) {
  errno: -54,
  code: 'ECONNRESET',
  syscall: 'read',
  fatal: true
*/
