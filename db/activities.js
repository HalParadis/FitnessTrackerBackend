const client = require('./client');

// database functions
async function createActivity({ name, description }) {
  // return the new activity

  const {
    rows: [activities],
  } = await client.query(
    `
    INSERT INTO activities(name, description)
    VALUES($1, $2)
   
    RETURNING *
    
    `,
    [name, description]
  );
  return activities;
}

async function getAllActivities() {
  // select and return an array of all activities
  try {
    const { rows } = await client.query(`
    SELECT id, name, description
    FROM activities;
    `);
    return rows;
  } catch (error) {
    console.log('not able to search for activities');
    throw error;
  }
}

async function getActivityById(id) {
  try {
    const { rows } = await client.query(`
    SELECT id, name, description
    FROM activities WHERE id=${id}
    `);
    return rows;
  } catch (error) {
    console.log('not able to search for activities');
    throw error;
  }
}

async function getActivityByName(name) {
  try {
    const { rows } = await client.query(`
    SELECT id, name, description
    FROM activities 
    WHERE name='${name}'
    `);
    return rows;
  } catch (error) {
    console.log('not able to search for activities', error);
    throw error;
  }
}

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
