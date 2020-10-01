/**
 * Export the `knexfile` database configuration ~ used with knex CLI for migrations.
 *
 * @author    Nick Freear, ?
 * @author    The Learning & Teaching Technologies team in IET <IET-LTT@open.ac.uk>
 * @copyright © 2019-2020 The Open University (IET).
 *
 * @see https://knexjs.org/#knexfile
 */

import * as Dotenv from 'dotenv'
import { readFileSync } from 'fs'
import * as Knex from 'knex'
import { join } from 'path'
// import { convertToBoolean } from '../HelperFunctions'

interface KnexFile {
    development?: Knex.Config
    staging    ?: Knex.Config
    production ?: Knex.Config
}

const ENV_FILE: string = join(__dirname, '..', '.env') // Was: (__dirname, '..', '..', '.env')
// const MIGRATION_DIR: string = join(__dirname, '..', 'migrations')

// NOTE: this 'config()' call occurs before the one in `index.ts`!
const result = Dotenv.config({ path: ENV_FILE })
if (result.error) {
    throw result.error
}
console.warn('Dotenv OK:', result.parsed.Database)

const {
  DbHost, DbPort, DbUser, DbPassword, Database, DbDebug, DbSsl, CaPath, NODE_ENV
} = process.env

const DB_CONFIG: Knex.Config = {
    client: 'mysql2',
    connection: { // Knex.MySqlConnectionConfig
        host: DbHost || 'localhost',
        port: parseInt(DbPort, 10) || 3306,
        database: Database,
        user: DbUser,
        password: DbPassword
        // charset: 'UTF8_GENERAL_CI'
        // filename: "./dev.sqlite3"
    },
    acquireConnectionTimeout: 100 * 1000, // Milliseconds (default 60000)
    pool: { min: 2, max: 20 },
    /* acquireConnectionTimeout: 60000, // Milliseconds.
    pool: { min: 2, max: 20 }, // MySQL default: 10. */
    /* migrations: {
        directory: MIGRATION_DIR,
        extension: 'ts',
        tableName: 'knex_migrations'
    }, */
    debug: DbDebug && DbDebug === 'true', // convertToBoolean(DbDebug)
}

if (DbSsl) {
    DB_CONFIG.connection['ssl'] = { ca: readFileSync(CaPath, 'utf8') }; // {ca: readFileSync(join(__dirname, '..', '..', DbSsl))}
}

const KNEX_CONFIG: KnexFile = {
    development: DB_CONFIG,

    staging: DB_CONFIG,

    production: DB_CONFIG
}

if (isKnexCli()) {
    console.warn('Knexfile :~', NODE_ENV, KNEX_CONFIG[ NODE_ENV ])
}

function isKnexCli(): boolean {
    return process.argv.length >= 3 && /\.bin\/knex$/.test(process.argv[1])
}

module.exports = KNEX_CONFIG
