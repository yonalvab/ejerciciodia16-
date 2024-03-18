import { createPool } from 'mysql2/promise'
import { DB_DATABASE, DB_HOST, DB_PASSWORD, DB_USERNAME, DB_PORT } from './config.js'

export const pool = createPool({
  host: DB_HOST,
  user: DB_USERNAME,
  password: DB_PASSWORD,
  port: DB_PORT,
  database: DB_DATABASE
})
