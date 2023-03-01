const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const passport = require('passport');
const mongoose = require('mongoose');
const config = require('./config/db');

// Use Node's default promise instead of Mongoose's promise library
mongoose.Promise = global.Promise;

mongoose.connect(
  config.db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
})
.then(() => console.log('MongoDB Connected'))
.catch((err) => console.log(err));

// Instantiate express
const app = express();

// Set public folder using built-in express.static middleware
app.use(express.static('public'));

// Set body parser middleware
app.use(bodyParser.json());

// Use passport middleware
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

// Initialize routes middleware
app.use('/api', require('./routes/projects'));
app.use('/api', require('./routes/entities'));
app.use('/api', require('./routes/proposals'));
app.use('/api', require('./routes/users'));

// Use express's default error handling middleware
app.use(function (err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }
  res.status(400).json({ err: err });
});

// Start the server
const port = process.env.PORT || 8081;

app.listen(8081, () => {
  console.log('Listening on port ' + port);
});
