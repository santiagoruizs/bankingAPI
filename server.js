const express = require('express')
const {query, pool} = require('./config/db');
const session = require('express-session');
const passport = require('passport');
const PORT = process.env.PORT
const passportConfig = require('./config/passport');

//routes
const auth = require('./routes/auth');
const account = require('./routes/account')
const transactions = require('./routes/transactions')

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
  expires: new Date(Date.now() + (60 * 1000)),
  cookie: { secure: true }, // HTTPS
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

//Transactions routes
app.use('/transactions', transactions);

app.get('/',  (req, res) => {
  res.status(200).json({status: 'ok'})
})

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})