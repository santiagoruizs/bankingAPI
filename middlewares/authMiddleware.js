const {findUserByUsername} = require('../models/User')

const checkAttempts = async (req, res, next) => {
  const user = await findUserByUsername(req.body.username)
  if(user){
    const {attempts} = user;
    if(attempts < 3){
      next()
    }else{
      return res.status(400).json({ message: 'Too many attempts, account is temporaly Locked' });
    }
  }else{
    return res.status(400).json({ message: 'User doesnt exist' });
  }
  
}
module.exports = {checkAttempts}