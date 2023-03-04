// require in dependencies
const express = require('express');

// require in routes

const PORT = 5000;
const app = express();

// request parsing (if needed)

// handle requests for static files

// route handlers

app.get('/api/v1', (req, res) => {
  res.send('hello !!!!');
});

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
