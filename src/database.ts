/**
 * Manage database connection ~ Mysql2, Knex, maybe Bookshelf ORM.
 *
 * @author    Nick Freear, ?
 * @author    The Learning & Teaching Technologies team in IET <IET-LTT@open.ac.uk>
 * @copyright © 2019-2020 The Open University (IET).
 *
 * @see https://github.com/knex/knex/blob/master/types/index.d.ts#L1791
 * @see https://sitepoint.com/javascript-design-patterns-singleton/
 */

import * as Knex from 'knex'
import * as KNEX_FILE from './knexfile'

class DatabaseConnection {

    private static singleton: DatabaseConnection

    private static knexClient: Knex

    constructor() {
        if (! DatabaseConnection.singleton) {
            DatabaseConnection.singleton = this
        }

        console.warn('DB singleton:', DatabaseConnection.singleton)

        return DatabaseConnection.singleton
    }

    public async connect(): Promise<Knex> {
        if (DatabaseConnection.knexClient) {
            console.warn('Database already connected (Knex).')
        } else {
            DatabaseConnection.knexClient = await this.knexConnect()
        }

        return DatabaseConnection.knexClient
    }

    public async close(): Promise<any> {
        await DatabaseConnection.knexClient.destroy((result: any) => {
            console.warn('Database - called knex.destroy() :', result)
        })
    }

    public getKnex(): Knex {
        return DatabaseConnection.knexClient
    }

    public queryBuilder(): Knex.QueryBuilder<any, any> {
        return DatabaseConnection.knexClient.queryBuilder()
    }

    // ------------------------------------------------------------

    private async knexConnect(): Promise<Knex> {
        try {
            const { NODE_ENV } = process.env

            const dbConfig: Knex.Config = KNEX_FILE[ NODE_ENV ]

            console.warn('Database options (Knex) :~', NODE_ENV, dbConfig)

            const knex: Knex = await Knex(dbConfig)

            // knex.select('*').from('test').limit(1).offset(0).then(res => console.log('Knex:', res))

            console.warn('Database connection OK (Knex):', knex.client)

            return knex
        } catch (err) {
            console.error('ABORTING')
            console.error('Database connection ERROR (Knex).')
            console.error(err)

            process.exit( 1 )
        }
    }
}

const instance = new DatabaseConnection()

Object.freeze(instance)

export default instance

// End.
