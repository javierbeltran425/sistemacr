require("dotenv").config()

// createUnixSocketPool initializes a Unix socket connection pool for
// a Cloud SQL instance of Postgres.
let dbConfig = {
  // Note: Saving credentials in environment variables is convenient, but not
  // secure - consider a more secure solution such as
  // Cloud Secret Manager (https://cloud.google.com/secret-manager) to help
  // keep secrets safe.
    client: 'pg',
    connection: {
      user: process.env.DB_USER, // e.g. 'my-user'
      password: process.env.DB_PASS, // e.g. 'my-user-password'
      database: process.env.DB_NAME, // e.g. 'my-database'3000
    },
    // ... Specify additional properties here.
  }

if (process.env.NODE_ENV == "production") {
  dbConfig.connection.host = process.env.DB_ADDRESS;
} else {
  dbConfig.connection.host = process.env.DB_HOST;
}

const knex = require('knex')(dbConfig);

module.exports = knex
