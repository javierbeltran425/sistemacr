require("dotenv").config();
const { cleanEnv, host, str, num } = require("envalid");
const env = cleanEnv(process.env, {
  DB_USER: str(),
  DB_PASS: str(),
  DB_HOST: host(),
  DB_NAME: str(),
  DB_PORT: num(),
});

// createUnixSocketPool initializes a Unix socket connection pool for
// a Cloud SQL instance of Postgres.
let dbConfig = {
  // Note: Saving credentials in environment variables is convenient, but not
  // secure - consider a more secure solution such as
  // Cloud Secret Manager (https://cloud.google.com/secret-manager) to help
  // keep secrets safe.
  client: "pg",
  connection: {
    user: env.DB_USER, // e.g. 'my-user'
    password: env.DB_PASS, // e.g. 'my-user-password'
    database: env.DB_NAME, // e.g. 'my-database'3000
    host: env.DB_HOST,
    port: env.DB_PORT,
  },
  // ... Specify additional properties here.
};

const knex = require("knex")(dbConfig);

module.exports = knex;
