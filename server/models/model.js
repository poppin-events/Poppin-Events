const { Pool } = require('pg');

const PG_URI = ''; // TODO: Add your own ElephantSQL URI

const pool = new Pool({
  connectionString: PG_URI,
});

module.exports = {
  query: (text, params, callback) => {
    console.log('executed query', text); // FIXME: Remove this line if unnecessary
    return pool.query(text, params, callback);
  },
};
