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
router.get('/me', async (req, res, next) => {
  const prefix = 'Bearer ';
  const auth = req.header('Authorization');

  // try {
  //   const token = auth.slice(prefix.length);
  //   const { id } = jwt.verify(token, JWT_SECRET);
  //   const user = await getUserById(id);

  //   console.log('user', user);

  //   res.send({message: 'hello world'});

  // } catch ({ name, message }) {
  //   next({ name, message });
  // }


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
        const user = await getUserById(id);
        res.send(user);
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


});

// GET /api/users/:username/routines
router.get('/:username/routines', async (req, res, next) => {
  const prefix = 'Bearer ';
  const auth = req.header('Authorization');
  const { username } = req.params;
  const routines = await getAllRoutinesByUser({ username });
  const token = auth.slice(prefix.length);
  const { id } = jwt.verify(token, JWT_SECRET);

  if (!auth || routines[0].creatorId != id) {
    res.send(routines.filter(routine => routine.isPublic));
  }
  else if (auth.startsWith(prefix)) {
    try {
      if (id) {
        res.send(routines);
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
})

module.exports = router;
