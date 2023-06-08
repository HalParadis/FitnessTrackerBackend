const express = require('express'); 
const { getAllRoutines } = require('../db');
const router = express.Router();

// GET /api/routines
router.get('/', async (req, res, next) => {
  try {
    const routines = await getAllRoutines();
    res.send(routines);
  }
  catch (error) {
    next(error);
  }
});

// POST /api/routines

// PATCH /api/routines/:routineId

// DELETE /api/routines/:routineId

// POST /api/routines/:routineId/activities

module.exports = router;
