/**
 *
 * @author Nick Freear, 01-October-2020.
 */

import * as Knex from 'knex'
import database from './database'

interface IdResult {
    id: number
}

getUserProfile();

async function getUserProfile () {
  const { StudentId } = process.env;

  try {
    const knex: Knex = await database.connect();

    // const knex: Knex = database.getKnex();

    console.log('Got DB client');

    // const result = await knex('users').count({ count: 'id' });

    count('users').then(count => console.log('User count:', count));
    count('user_profile').then(count => console.log('Profile count:', count));

    const userIdRes: IdResult = await knex('users').timeout(5000).where({ student_id: StudentId }).first('id')

    console.log('User:', userIdRes);

    const userId: number = userIdRes ? userIdRes.id : null;

    const profile = await knex('user_profile').where({ user_id: userId }).limit(2); // .first();

    console.log('Profile:', JSON.stringify(profile, null, 2));
  } catch (err) {
    console.error('ABORTING');
    console.error('Database ERROR (Knex).');
    console.error(err);
    // console.error(err.stack);

    process.exit( 1 );
  }
}

async function count (table = 'users') {
  const knex: Knex = database.getKnex();

  const result = await knex(table).count({ count: 'id' });

  return result ? result[ 0 ].count : null;
}
