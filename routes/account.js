const express = require('express');
const passport = require('passport');
const { addFundsToAccount, widthdrawFunds, getAccountInfoByUserId, checkSufficientBalance, transferAccountFunds } = require('../models/Account');
const router = express.Router();

const checkBalance = async (req, res, next) => {
    const user_id = req.params.user_id
    const {ammount} = req.body
    const sufficientBalance = await checkSufficientBalance(user_id, ammount)
    if(sufficientBalance){
        next()
    }else{
        res.status(400).json({message : 'Not Enough funds'})
    }

}

//Get Account Info
router.get('/:user_id', async (req, res) => {
    const user_id = req.params.user_id
    try{
        const account = await getAccountInfoByUserId(user_id)
        res.status(200).json(account);
    }catch(err){
        return res.status(500).json({ message: err.message });
    }   
});
// deposit
router.put('/:user_id/deposit', async (req, res) => {
    const user_id = req.params.user_id
    const {ammount} = req.body
    const parsedAmount = parseFloat(ammount)

    try{
        const newBalance = await addFundsToAccount(user_id, parsedAmount)
        res.status(200).json({ message: 'Funds added', balance: newBalance });
    }catch(err){
        return res.status(500).json({ message: err.message });
    }   
});

// widthdraw
router.put('/:user_id/widthdraw', checkBalance, async (req, res) => {
    const user_id = req.params.user_id
    const {ammount} = req.body
    const parsedAmount = parseFloat(ammount)
    try{
        const newBalance = await widthdrawFunds(user_id, parsedAmount)
        res.status(200).json({ message: 'Funds added', balance: newBalance });
    }catch(err){
        return res.status(500).json({ message: err.message });
    }  
});

// transfer
router.put('/:user_id/transfer', checkBalance, async (req, res) => {
    const user_id = req.params.user_id
    // console.log(req.body)
    const {ammount, toAccountNumber} = req.body
    const parsedAmount = parseFloat(ammount)
    try{
        const newBalance = await transferAccountFunds(user_id, toAccountNumber, parsedAmount)
        res.status(200).json({ message: 'Transfer done succesfully', balance: newBalance });
    }catch(err){
        return res.status(500).json({ message: err.message });
    }  
});


module.exports = router;
