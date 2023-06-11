require("dotenv").config()
const express = require("express")
const app = express()

// Setup your Middleware and API Router here
const { 
  getUserById
} = require('./db');

const cors = require('cors');
app.use(cors());

const bodyParser = require('body-parser');
app.use(bodyParser.json());

const apiRouter = require('./api');
app.use('/api', apiRouter);


//from juicebox-api/index
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;

// apiRouter.use(async (req, res, next) => {
//   const prefix = 'Bearer ';
//   const auth = req.header('Authorization');

//   console.log("----****-----------Hal looks silly");

//   if (!auth) {
//     next();
//   } else if (auth.startsWith(prefix)) {
//     const token = auth.slice(prefix.length);

//     try {
//       const { id } = jwt.verify(token, JWT_SECRET);
      
//       console.log("id: ", id);

//       if (id) {
//         req.user = await getUserById(id);
//         console.log("User is set:", req.user);
//         next();
//       }
//     } catch ({ name, message }) {
//       next({ name, message });
//     }
//   } else {
//     next({
//       name: 'AuthorizationHeaderError',
//       message: `Authorizaiton token must start with ${ prefix }`
//     });
//   }
// });






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
