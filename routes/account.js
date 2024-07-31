const express = require('express');
const passport = require('passport');
const { addFundsToAccount, widthdrawFunds, getAccountInfoByUserId } = require('../models/Account');
const router = express.Router();

//Get Account Info
router.get('/:user_id', async (req, res) => {
    const user_id = req.params.user_id
    try{
        const account = await getAccountInfoByUserId(user_id)
        res.status(200).json(account);
    }catch(err){
        return res.status(500).json({ message: 'Server error' });
    }   
});
// Add Funds
router.put('/:user_id/addfunds', async (req, res) => {
    const user_id = req.params.user_id
    const {ammount} = req.body
    const parsedAmount = parseFloat(ammount)

    try{
        const newBalance = await addFundsToAccount(user_id, parsedAmount)
        res.status(200).json({ message: 'Funds added', balance: newBalance });
    }catch(err){
        return res.status(500).json({ message: 'Server error' });
    }   
});

// widthdraw
router.put('/:user_id/widthdraw', async (req, res) => {
    const user_id = req.params.user_id
    const {ammount} = req.body
    const parsedAmount = parseFloat(ammount)
    try{
        const newBalance = await widthdrawFunds(user_id, parsedAmount)
        res.status(200).json({ message: 'Funds added', balance: newBalance });
    }catch(err){
        return res.status(500).json({ message: 'Server error' });
    }  
});



module.exports = router;
