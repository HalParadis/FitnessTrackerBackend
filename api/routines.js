const express = require('express'); 
const {  
  getAllPublicRoutines,
  createRoutine,
  updateRoutine, 
  getRoutineById,
  destroyRoutine,
  destroyRoutineActivity,
  getRoutineActivitiesByRoutine,
  addActivityToRoutine,
} = require('../db');
const router = express.Router();

const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;

// GET /api/routines
router.get('/', async (req, res, next) => {
  try {
    const routines = await getAllPublicRoutines();
    res.send(routines);
  }
  catch (error) {
    next(error);
  }
});

// POST /api/routines
router.post('/', async (req, res, next) => {
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
      const { name, goal, isPublic } = req.body;
  
      if (id) {
        const routine = await createRoutine({ creatorId: id, name, goal, isPublic });
        res.send(routine);
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

// PATCH /api/routines/:routineId
router.patch('/:routineId', async (req, res, next) => {
  const prefix = 'Bearer ';
  const auth = req.header('Authorization');

  const { routineId } = req.params;

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
      const { name, goal, isPublic } = req.body;

      const unmodifiedRoutine = await getRoutineById(routineId);
  
      if (id == unmodifiedRoutine.creatorId) {
        const routine = await updateRoutine({ id: routineId, name, goal, isPublic });
        res.send(routine);
      }
      else {
        res.status(403);
        res.send({
          error: 'Invalid User!',
          name: "InvalidUserError",
          message: `User ${username} is not allowed to update ${unmodifiedRoutine.name}`
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

// DELETE /api/routines/:routineId
router.delete('/:routineId', async (req, res, next) => {
  const prefix = 'Bearer ';
  const auth = req.header('Authorization');

  const { routineId } = req.params;

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

      const unmodifiedRoutine = await getRoutineById(routineId);
  
      if (id == unmodifiedRoutine.creatorId) {
        const routineActivities = await getRoutineActivitiesByRoutine(unmodifiedRoutine);
        Promise.all(routineActivities.map(async routineActivity => {
          return await destroyRoutineActivity(routineActivity);
        }));
        const routine = await destroyRoutine(routineId);
        res.send(routine);
      }
      else {
        res.status(403);
        res.send({
          error: 'Invalid User!',
          name: "InvalidUserError",
          message: `User ${username} is not allowed to delete ${unmodifiedRoutine.name}`
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


// POST /api/routines/:routineId/activities
router.post('/:routineId/activities', async (req, res, next) => {
  try {
    const { activityId, count, duration } = req.body;
    const { routineId } = req.params;

    const routineActivity = await addActivityToRoutine({ 
      routineId, activityId, count, duration });
      
    res.send(routineActivity ?? {
      error: 'DuplicateRoutineActivityError',
      message: `Activity ID ${activityId} already exists in Routine ID ${routineId}`,
      name: 'DuplicateRoutineActivityError'
    });
  }
  catch ({ name, message }) {
    next({ name, message });
  }
}); 

module.exports = router;
