const express = require('express');
const {getTransactionsByAccount} = require('../models/Transactions');
const router = express.Router();

//Get Transactions
router.get('/:accountNumber', async (req, res) => {
    const accountNumber = req.params.accountNumber
    try{
        const transaction = await getTransactionsByAccount(accountNumber)
        res.status(200).json(transaction);
    }catch(err){
        return res.status(500).json({ message: err.message });
    }   
});


module.exports = router;
