const express = require('express');
const router = express.Router();

const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;

const {
  getAllActivities,
  createActivity,
  updateActivity,
  getActivityByName,
  getPublicRoutinesByActivity,
  getActivityById
} = require('../db');

// GET /api/activities
router.get('/', async (req, res, next) => {
  try {
    const activities = await getAllActivities();
    res.send(activities);
  }
  catch ({ name, message }) {
    next({ name, message });
  }
});

// POST /api/activities
router.post('/', async (req, res, next) => {
  const prefix = 'Bearer ';
  const auth = req.header('Authorization');
  const { name, description } = req.body;

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
        const activity = await createActivity({ name, description });
        res.send(activity ?? {
          name: 'DuplicateActivityError',
          error: 'DuplicateActivityError',
          message: `An activity with name ${name} already exists`
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

// PATCH /api/activities/:activityId
router.patch('/:activityId', async (req, res, next) => {
  const prefix = 'Bearer ';
  const auth = req.header('Authorization');
  const { activityId } = req.params;

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
      const { name, description } = req.body;
      const duplicateActivity = await getActivityByName(name);
  
      if (duplicateActivity) {
        res.send({
          message: `An activity with name ${name} already exists`,
          name: 'DuplicateNameError',
          error: 'DuplicateNameError'
        })
      }
      else if (id) {
        const activity = await updateActivity({ id: activityId, name, description });
        res.send(activity ?? {
          name: 'NoActivityFoundError',
          error: 'NoActivityFoundError',
          message: `Activity ${activityId} not found`
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

// GET /api/activities/:activityId/routines
router.get('/:activityId/routines', async (req, res, next) => {
  try {
    const { activityId } = req.params;
    const activity = await getActivityById(activityId);

    if (activity) {
      const routines = await getPublicRoutinesByActivity(activity);
      res.send(routines);
    }
    else {
      res.send({
        message: `Activity ${activityId} not found`,
        name: 'ActivityNotFoundError',
        error: 'ActivityNotFoundError'
      });
    }
  }
  catch ({ name, message }) {
    next({ name, message });
  }
});

module.exports = router;
