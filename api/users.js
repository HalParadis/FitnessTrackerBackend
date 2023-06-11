/* eslint-disable no-useless-catch */
const express = require("express");
const router = express.Router();
const { requireUser } = require('./utils');

const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;

const {
  getUserByUsername,
  createUser,
  getUser,
  getAllRoutinesByUser,
  getUserById
} = require('../db');

// POST /api/users/register
router.post('/register', async (req, res, next) => {
  //console.log("req.body", req.body);

  try {
    const { username, password } = req.body;

    const badUser = await getUserByUsername(username);

    if (badUser) {
      //why is res.send used? instead of "next"
      res.send({
        error: "UserExistsError",
        name: 'UserExistsError',
        message: `User ${badUser.username} is already taken.`
      });
    }

    if (password.length < 8) {
      //why is res.send used? instead of "next"
      res.send({
        error: "PasswordTooShort",
        name: "PasswordTooShort",
        message: "Password Too Short!"
      });
    }


    const user = await createUser({
      username,
      password
    });

    const token = jwt.sign({
      id: user.id,
      username: user.username
    }, process.env.JWT_SECRET, {
      expiresIn: '1w'
    });

    //console.log("here for User", user);
    res.send({
      user,
      message: "Thank you for registering",
      token
    });

  } catch ({ name, message }) {
    next({ name, message })
  }
});

// POST /api/users/login
router.post('/login', async (req, res, next) => {
  const { username, password } = req.body;

  try {
    const user = await getUser({ username, password });

    if (user) {
      const token = jwt.sign({
        id: user.id,
        username: user.username,
        password: user.password
      }, JWT_SECRET);

      res.send({
        user,
        message: "you're logged in!",
        token: token
      })
    }

  } catch ({ name, message }) {
    next({ name, message })
  }

});

// GET /api/users/me
router.get('/me', requireUser, async (req, res, next) => {
  // const prefix = 'Bearer ';
  // const auth = req.header('Authorization');


  try {
    res.send(req.user);

  } catch ({ name, message }) {
    next({ name, message });
  }


  // if (!auth) {
  //   res.status(401);
  //   res.send({
  //     error: 'Invalid token!',
  //     name: "InvalidTokenError",
  //     message: "You must be logged in to perform this action"
  //   });
   
  // } else if (auth.startsWith(prefix)) {
  //   const token = auth.slice(prefix.length);

  //   try {
  //     const { id } = jwt.verify(token, JWT_SECRET);
  
  //     if (id) {
  //       const user = await getUserById(id);
  //       console.log("User is set: ", user);
 
  //       res.send(user);
  //     }

  //   } catch ({ name, message }) {
  //     next({ name, message });
  //   }

  // } else {
  //   next({
  //     name: 'AuthorizationHeaderError',
  //     message: `Authorizaiton token must start with ${prefix}`
  //   });
  // }


});

// GET /api/users/:username/routines
router.get('/:username/routines', async (req, res, next) => {
  const { username, password } = req. body;
  const publicRoutinesByUser = await getAllRoutinesByUser(username);

  res.send(publicRoutinesByUser)

})

module.exports = router;
