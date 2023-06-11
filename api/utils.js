const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;

const { 
  getUserById
} = require('../db');

async function requireUser(req, res, next) {
  const prefix = 'Bearer ';
  const auth = req.header('Authorization');

  if (!auth) {
    res.status(401);
    res.send({
      error: 'Invalid token!',
      name: "InvalidTokenError",
      message: "You must be logged in to perform this action"
    });
   
  } else if (auth.startsWith(prefix)) {
    const token = auth.slice(prefix.length);

    try {
      const { id } = jwt.verify(token, JWT_SECRET);
  
      if (id) {
        const req.user = await getUserById(id);

        console.log("User is set: ", user);
 
        next();
      }

    } catch ({ name, message }) {
      next({ name, message });
    }

  } else {
    next({
      name: 'AuthorizationHeaderError',
      message: `Authorizaiton token must start with ${prefix}`
    });
  }

  next();
}

module.exports = {
  requireUser
}