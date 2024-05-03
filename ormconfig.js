const dotenv = require('dotenv');

dotenv.config();

const {
  DB_TYPE,
  POSTGRES_HOST,
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  PGPORT,
  POSTGRES_DB,
} = process.env;

module.exports = {
  type: DB_TYPE,
  host: POSTGRES_HOST,
  port: PGPORT,
  username: POSTGRES_USER,
  password: POSTGRES_PASSWORD,
  database: POSTGRES_DB,
  migrations: [__dirname + '/src/migrations/*{.ts,.js}'],
  entities: [__dirname + '/src/**/*.entity.{ts,js}'],
};
