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
  DbHost, DbPort, DbUser, DbPassword, Database, DbSsl, DbTables, Compress, CaFilePath
} = process.env;

const CONFIG: Mysqldump.Options = {
    connection: {
        host: DbHost || 'localhost',
        port: parseInt(DbPort, 10) || 3306,
        user: DbUser || 'root',
        password: DbPassword || '123456',
        database: Database || 'my_database',

        ssl: DbSsl ? {
          ca: readFileSync(CaFilePath, 'utf8') // join(__dirname, '..', '..', 'BaxxxCyberTrustRoot.crt.pem'))
        }
        : null,
    },

    dump: {
      tables: DbTables ? DbTables.split(',') : [ ],
    },

    dumpToFile: Compress ? './dump.sql.gz' : './dump.sql',
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
