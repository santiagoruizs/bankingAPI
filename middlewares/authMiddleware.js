const {findUserByUsername} = require('../models/User')

const checkAttempts = async (req, res, next) => {
  const {attempts} = await findUserByUsername(req.body.username)
  if(attempts < 3){
    next()
  }else{
    return res.status(400).json({ message: 'Too many attempts, account is temporaly Locked' });
  }
}
module.exports = {checkAttempts}