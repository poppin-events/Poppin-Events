const { Pool } = require('pg');

const PG_URI = 'postgres://leekwldv:85zQjHG1-BdoK3wOIfWOGl63DL85OW9c@mahmud.db.elephantsql.com/leekwldv';

// create new pool
const pool = new Pool({
  connectionString: PG_URI,
});

module.exports = {
  query: (text, params, callback) => {
    console.log('executing query', text, 'with params: ', params);
    return pool.query(text, params, callback);
  },
};
