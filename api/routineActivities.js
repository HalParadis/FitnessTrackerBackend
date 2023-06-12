const express = require('express');
const router = express.Router();

const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;

const {
  updateRoutineActivity,
  getRoutineActivityById,
  getRoutineById,
  destroyRoutineActivity
} = require('../db');
// PATCH /api/routine_activities/:routineActivityId
router.patch('/:routineActivityId', async (req, res, next) => {
  const prefix = 'Bearer ';
  const auth = req.header('Authorization');

  const { routineActivityId } = req.params;

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
      const { id, username } = jwt.verify(token, JWT_SECRET);
      const { count, duration } = req.body;

      const { routineId } = await getRoutineActivityById(routineActivityId);
      const { creatorId, name } = await getRoutineById(routineId);

      
 
      if ( id === creatorId ) {

        const routineActivity = await updateRoutineActivity({ id: routineActivityId, count, duration });
        res.send(routineActivity);
      }
      else {
        res.status(403);
        res.send({
          error: 'Invalid User!',
          name: "InvalidUserError",
          message: `User ${username} is not allowed to update ${name}`
        });
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

// DELETE /api/routine_activities/:routineActivityId
router.delete('/:routineActivityId', async (req, res, next) => {
  const prefix = 'Bearer ';
  const auth = req.header('Authorization');

  const { routineActivityId } = req.params;

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
      const { id, username } = jwt.verify(token, JWT_SECRET);

      const { routineId } = await getRoutineActivityById(routineActivityId);
      const { creatorId, name } = await getRoutineById(routineId);
  
      if ( id === creatorId ) {
        const routineActivity = await destroyRoutineActivity(routineActivityId);
        res.send(routineActivity);
      }
      else {
        res.status(403);
        res.send({
          error: 'Invalid User!',
          name: "InvalidUserError",
          message: `User ${username} is not allowed to delete ${name}`
        });
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
