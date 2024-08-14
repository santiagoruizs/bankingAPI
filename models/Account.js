const { pool } = require("../config/db");

// Account queries
async function createAccount(userId) {
  let accountNumber = "";
  for (let i = 0; i < 8; i++) {
    // Generate a random digit between 0 and 9 and append it to the account number
    accountNumber += Math.floor(Math.random() * 10);
  }
  const query =
    "INSERT INTO accounts (account_number, user_id, balance) VALUES ($1, $2, $3) RETURNING account_number, balance";
  const values = [accountNumber, userId, 2000];
  const res = await pool.query(query, values);
  return res.rows[0];
}

async function getAccountInfoByUserId(userId) {
  const query = "SELECT * FROM accounts WHERE user_id = $1";
  const values = [userId];
  const res = await pool.query(query, values);
  return res.rows[0];
}

async function getAccountInfoByAccountNumber(acountNumber) {
  const query = "SELECT * FROM accounts WHERE account_number = $1";
  const values = [acountNumber];
  const res = await pool.query(query, values);
  return res.rows[0];
}

async function checkSufficientBalance(user_id, amount) {
  const query = "SELECT balance FROM accounts WHERE user_id = $1";
  const values = [user_id];
  const res = await pool.query(query, values);
  return res.rows[0].balance > amount;
}

async function transferAccountFunds(user_id, toAccountNumber, amount) {
  try {
    const parsedAmount = parseFloat(amount)
    console.log(amount)
    console.log(toAccountNumber)
    await pool.query("BEGIN");

    const subtractFundsQuery = `
      UPDATE accounts
      SET balance = balance - $1
      WHERE user_id = $2
      RETURNING balance;
    `;
    const subtractValues = [parsedAmount, user_id];
    const subtractRes = await pool.query(subtractFundsQuery, subtractValues);
    console.log(subtractRes.rows)
    const addFundsQuery = `
    UPDATE accounts
    SET balance = balance + $1
    WHERE account_number = $2
    RETURNING balance;
    `;
    const addValues = [parsedAmount, toAccountNumber];
    const addRes = await pool.query(addFundsQuery, addValues);
    console.log(addRes.rows)
    if (addRes.rows.length === 0) {
      throw new Error("Destination account not found");
    }
    await pool.query("COMMIT");

    return {
      fromAccountBalance: subtractRes.rows[0].balance,
    };
  } catch (error) {
    await pool.query("ROLLBACK");
    throw error;
  } 
}

async function addFundsToAccount(user_id, amount) {
  const query =
    "UPDATE accounts set balance = balance + $1 WHERE user_id = $2 RETURNING balance";
  const values = [amount, user_id];
  const res = await pool.query(query, values);
  return res.rows[0];
}

async function widthdrawFunds(user_id, amount) {
  const query =
    "UPDATE accounts set balance = balance - $1 WHERE user_id = $2 RETURNING balance";
  const values = [amount, user_id];
  const res = await pool.query(query, values);
  return res.rows[0];
}

// async function deleteAccount(username) {
//     const query = 'UPDATE users set attempts = 0 WHERE username = $1 RETURNING attempts';
//     const values = [username];
//     const res = await pool.query(query, values);
//     return res.rows[0];
//   }

module.exports = {
  createAccount,
  getAccountInfoByUserId,
  getAccountInfoByAccountNumber,
  addFundsToAccount,
  widthdrawFunds,
  checkSufficientBalance,
  transferAccountFunds
};
