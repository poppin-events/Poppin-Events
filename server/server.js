// require in dependencies
const path = require('path');
const express = require('express');
const session = require('express-session');
const apiRouter = require('./routes/api');

// require in routes

const PORT = 5000;
const app = express();

// request parsing (if needed)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: 'af168f987f1gh78fhg91f',
    name: 'ssid',
    saveUninitialized: false,
  })
);
// handle requests for static files
app.use(express.static(path.resolve(__dirname, '../dist')));
// route handlers

app.use('/api', apiRouter);

// catch-all 404 route handler
app.use((_, res) => res.status(404).send('Page Not Found'));

// error handler
app.use((err, req, res, next) => {
  const defaultErr = {
    log: 'Express error handler caught unknown middleware error',
    status: 500,
    message: { err: 'An error occurred' },
  };
  const errorObj = { ...defaultErr, ...err };
  console.log(errorObj.log);
  return res.status(errorObj.status).json(errorObj.message).redirect('/');
});

// start server
app.listen(PORT, () => console.log(`start listening on port : ${PORT}`));

module.exports = app;
