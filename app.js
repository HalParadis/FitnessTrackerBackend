require("dotenv").config()
const express = require("express")
const app = express()

// Setup your Middleware and API Router here

const cors = require('cors');
app.use(cors());

const apiRouter = require('./api');
app.use('/api', apiRouter);

// Create custom 404 handler that sets the status code to 404.
apiRouter.use('*', (req, res, next) => {
  res.status(404);
  res.send({error: 'Route not found'});
});

// Create custom error handling that sets the status code to 500
// and returns the error as an object
apiRouter.use((err, req, res, next) => {
  res.status(500);
  res.send({err});
});


module.exports = app;
