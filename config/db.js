const { Pool } = require('pg')
require("dotenv").config()
const fs = require("fs")

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    ssl: {
      require: true,
      rejectUnauthorized: false,
      ca: fs.readFileSync('./services/ca.pem')
    }
})

const query = (text, params, callback) => {
    return pool.query(text, params, callback)
  }
module.exports = {query, pool}