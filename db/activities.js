const client = require('./client');

// database functions
async function createActivity({ name, description }) {
  const {rows: [activity]} = await client.query(`
    INSERT INTO 
      activities(name, description)
    VALUES
      ($1, $2)
    ON CONFLICT
      (name) DO NOTHING
    RETURNING *;
  `, [name, description]);

  return activity;
}

async function getAllActivities() {
  const {rows: activities} = await client.query(`
    SELECT * FROM activities;
  `);
  return activities;
}

async function getActivityById(id) {}

async function getActivityByName(name) {}

// used as a helper inside db/routines.js
async function attachActivitiesToRoutines(routines) {}

async function updateActivity({ id, ...fields }) {
  // don't try to update the id
  // do update the name and description
  // return the updated activity
}

module.exports = {
  getAllActivities,
  getActivityById,
  getActivityByName,
  attachActivitiesToRoutines,
  createActivity,
  updateActivity,
};
