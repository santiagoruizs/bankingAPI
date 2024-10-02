const express = require('express')
const {query, pool} = require('./config/db');
const session = require('express-session');
const passport = require('passport');
const PORT = process.env.PORT
const passportConfig = require('./config/passport');
const auth = require('./routes/auth');
const account = require('./routes/account')
const cors = require('cors')
require("dotenv").config()

const app = express()

app.use(session({
  // store: new pgSession({
  //   pool: pool,
  //   tableName: 'session'
  // }),
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }, // HTTPS
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

passportConfig(passport);

// cors
app.use(cors())
// Body parser middlewares
app.use(express.json());  
app.use(express.urlencoded({ extended: true }));
// Session Control
app.use(passport.authenticate('session'));
//Auth routes
app.use('/auth', auth);

//Account routes
app.use('/account', account);

app.get('/',  (req, res) => {
  res.status(200).json({status: 'ok'})
})


// app.get('/users', (req, res) => {
//   query('select * from users;',(error, results) => {
//       if(error){
//           res.status(400).json({msg: error.message})
//       }
//       res.status(200).json(results.rows)
//   })
// })

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})