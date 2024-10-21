const { pool } = require("../config/db");
const {logTransaction} = require('./Transactions')
// Account queries
async function createAccount(userId) {
  try{
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
  }catch(err){
    console.error('Error creating the account:', err);
    return res.status(500).json({ msg: err.message });
  }
  
}

async function getAccountInfoByUserId(userId) {
  try{
    const query = "SELECT * FROM accounts WHERE user_id = $1";
    const values = [userId];
    const res = await pool.query(query, values);
    return res.rows[0];
  }catch(err){
    console.error('Error getting info from user:', err);
    return res.status(500).json({ msg: err.message });
  }
  
}

async function getAccountInfoByAccountNumber(acountNumber) {
  try{
    const query = "SELECT * FROM accounts WHERE account_number = $1";
    const values = [acountNumber];
    const res = await pool.query(query, values);
  return res.rows[0];
  }catch(err){
    console.error('Error getting info from user:', err);
    return res.status(500).json({ msg: err.message });
  }
  
}

async function checkSufficientBalance(user_id, amount) {
  try{
    const query = "SELECT balance FROM accounts WHERE user_id = $1";
    const values = [user_id];
    const res = await pool.query(query, values);
    return res.rows[0].balance > amount;
  }catch(err){
    console.error('Error consulting sufficient balance:', err);
    return res.status(500).json({ msg: err.message });
  }
  
}

async function transferAccountFunds(user_id, toAccountNumber, amount) {
  try {
    const parsedAmount = parseFloat(amount)
    // console.log(amount)
    // console.log(toAccountNumber)
    await pool.query("BEGIN");

    const subtractFundsQuery = `
      UPDATE accounts
      SET balance = balance - $1
      WHERE user_id = $2
      RETURNING account_number, balance;
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
    const {account_number, balance} = subtractRes.rows[0]
    const trans = await logTransaction(account_number, toAccountNumber, 'transfer', amount, "test")
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
  try{
    const query =
    "UPDATE accounts set balance = balance + $1 WHERE user_id = $2 RETURNING account_number, balance";
    const values = [amount, user_id];
    const res = await pool.query(query, values);
    const {account_number, balance} = res.rows[0]
    const trans = await logTransaction(account_number, null, 'deposit', amount, "test")
    return res.rows[0];
  }catch(err){
    console.error('Error adding funds:', err); 
    return res.status(500).json({ msg: err.message });
  }
  
}

async function widthdrawFunds(user_id, amount) {
  try{
    const query =
    "UPDATE accounts set balance = balance - $1 WHERE user_id = $2 RETURNING account_number, balance";
    const values = [amount, user_id];
    const res = await pool.query(query, values);
    const {account_number, balance} = res.rows[0]
    const trans = await logTransaction(account_number, null, 'widthdraw', amount, "test")
    return res.rows[0];
  }catch(err){
    console.error('Error creating the account:', err);
    return res.status(500).json({ msg: err.message });
  }
  
}
// async function logTransaction(fromAccountNumber, toAccountNumber, transaction_type, amount, category) {
//   try{
//     const query =
//     `INSERT INTO transactions (from_account_number, to_account_number, transaction_type, ammount, category, transaction_time) 
//     VALUES($1, $2, $3, $4, $5, NOW()) RETURNING from_account_number, ammount, transaction_time`;
//     const values = [fromAccountNumber, toAccountNumber, transaction_type, amount, category];
//     const res = await pool.query(query, values);
//     return res.rows[0];
//   }catch(err){
//     console.error('Error creating the account:', err);
//     return res.status(500).json({ msg: err.message });
//   }
  
// }

// async function getTransactionsByAccount(accountNumber) {
//   try{
//     const query =
//     `select * from transactions where from_account_number = $1 or to_account_number = $1`;
//     const values = [accountNumber];
//     const res = await pool.query(query, values);
//     console.log(res.rows[0])
//     return res.rows[0];
//   }catch(err){
//     console.error('Error creating the account:', err);
//     return res.status(500).json({ msg: err.message });
//   }
  
// }
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
