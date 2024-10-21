const { pool } = require("../config/db");

async function logTransaction(fromAccountNumber, toAccountNumber, transaction_type, amount, category) {
    try{
      const query =
      `INSERT INTO transactions (from_account_number, to_account_number, transaction_type, ammount, category, transaction_time) 
      VALUES($1, $2, $3, $4, $5, NOW()) RETURNING from_account_number, ammount, transaction_time`;
      const values = [fromAccountNumber, toAccountNumber, transaction_type, amount, category];
      const res = await pool.query(query, values);
      return res.rows[0];
    }catch(err){
      console.error('Error creating the account:', err);
      return res.status(500).json({ msg: err.message });
    }
    
  }
  
  async function getTransactionsByAccount(accountNumber) {
    try{    
      const query =
      `select transaction_time as Date, transaction_type Type, category Category, ammount as Ammount, to_account_number from transactions where from_account_number = $1 or to_account_number = $1
      order by transaction_time desc`;
      const values = [accountNumber];
      const res = await pool.query(query, values);
      return res.rows;
    }catch(err){
      console.error('Error creating the account:', err);
      return res.status(500).json({ msg: err.message });
    }
    
  }

  module.exports = {
    logTransaction,
    getTransactionsByAccount
  };