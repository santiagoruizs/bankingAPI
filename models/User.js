const {pool} = require('../config/db');
const bcrypt = require('bcryptjs');

// User queries
async function createUser(username, password, email) {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const query = 'INSERT INTO public.users (username, password, email, attempts) VALUES ($1, $2, $3, 0) RETURNING id, username';
  const values = [username, hashedPassword, email];
  const res = await pool.query(query, values);
  return res.rows[0];
}

async function findUserByUsername(username) {
  const query = 'SELECT * FROM public.users WHERE username = $1';
  const values = [username];
  const res = await pool.query(query, values);
  return res.rows[0];
} 

async function findUserById(id) {
  const query = 'SELECT id, username FROM public.users WHERE id = $1';
  const values = [id];
  const res = await pool.query(query, values);
  return res.rows[0];
}

async function addLoginAttempt(username) {
  const query = 'UPDATE public.users set attempts = attempts + 1 WHERE username = $1 RETURNING attempts';
  const values = [username];
  const res = await pool.query(query, values);
  return res.rows[0];
}

async function resetLoginAttempts(username) {
  const query = 'UPDATE public.users set attempts = 0 WHERE username = $1 RETURNING attempts';
  const values = [username];
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
  addLoginAttempt,
  resetLoginAttempts
};