const {pool} = require('../config/db');
const bcrypt = require('bcryptjs');

// User queries
async function createUser(username, password, email) {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const query = 'INSERT INTO users (username, password, email) VALUES ($1, $2, $3) RETURNING id, username';
  const values = [username, hashedPassword, email];
  const res = await pool.query(query, values);
  return res.rows[0];
}

async function findUserByUsername(username) {
  const query = 'SELECT * FROM users WHERE username = $1';
  const values = [username];
  const res = await pool.query(query, values);
  return res.rows[0];
}

async function findUserById(id) {
  const query = 'SELECT id, username FROM users WHERE id = $1';
  const values = [id];
  const res = await pool.query(query, values);
  return res.rows[0];
}

async function comparePassword(candidatePassword, hash) {
  return bcrypt.compare(candidatePassword, hash);
}

module.exports = {
  createUser,
  findUserByUsername,
  findUserById,
  comparePassword,
};