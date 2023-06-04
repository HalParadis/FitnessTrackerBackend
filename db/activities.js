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

async function getActivityById(id) {
  const { rows: [ activity ] } = await client.query(`
    SELECT *
    FROM activities
    WHERE id=$1;
  `, [id]);

  return activity;
}

async function getActivityByName(name) {
  const { rows: [ activity ] } = await client.query(`
    SELECT *
    FROM activities
    WHERE name=$1;
  `, [name]);

  return activity;
}

// used as a helper inside db/routines.js
async function attachActivitiesToRoutines(routines) {
  
}

async function updateActivity( { id, ...fields } ) {
  // don't try to update the id
  // do update the name and description
  // return the updated activity

  //QUESTION - spread on the object fields -meaning -?
  //console.log("here", fields);
  const setString = Object.keys(fields).map(
    (key, index) => `"${ key }"=$${ index + 1 }`
  ).join(', ');

  if (setString.length === 0) {
    return;
  }

  const { rows: [ activity ] } = await client.query(`
    UPDATE activities
    SET ${ setString }
    WHERE id=${ id }
    RETURNING *;
  `, [...Object.values(fields)]);

  return activity;
}

module.exports = {
  getAllActivities,
  getActivityById,
  getActivityByName,
  attachActivitiesToRoutines,
  createActivity,
  updateActivity,
};
