const client = require('./client');

async function createRoutine({ creatorId, isPublic, name, goal }) {
  try {
    const {
      rows: [routines],
    } = await client.query(
      `
      INSERT INTO routines(name, "creatorId", "isPublic", goal )
      VALUES($1, $2, $3, $4)
      RETURNING *
    `,
      [name, creatorId, isPublic, goal]
    );

    return routines;
  } catch (error) {
    console.error(error);
  }
}

async function getRoutineById(id) {
  try {
    const { rows } = await client.query(`
      SELECT r.id, r."creatorId", r."isPublic", r.name, r.goal 
      FROM routines as r WHERE r.id=${id};
    `);
    return rows;
  } catch (error) {
    console.error(error);
  }
}

async function getRoutinesWithoutActivities() {
  try {
    const { rows } = await client.query(`
      SELECT r.id, r."creatorId", r."isPublic", r.name, r.goal 
      FROM routines as r LEFT JOIN routine_activities as ra ON r.id = ra."routineId"
      WHERE ra."activityId" IS NULL ;
    `);
    return rows;
  } catch (error) {
    console.error(error);
  }
}

async function getAllRoutines() {
  try {
    const { rows } = await client.query(`
      SELECT r.id, r."creatorId", r."isPublic", r.name, r.goal 
      FROM routines as r;
    `);
    return rows;
  } catch (error) {
    console.error(error);
  }
}

async function getAllPublicRoutines() {
  try {
    const { rows } = await client.query(`
      SELECT r.id, r."creatorId", r."isPublic", r.name, r.goal 
      FROM routines as r WHERE r."isPublic"= true;
    `);
    return rows;
  } catch (error) {
    console.error(error);
  }
}

async function getAllRoutinesByUser({ username }) {
  try {
    const { rows } = await client.query(`
      SELECT r.id, r."creatorId", r."isPublic", r.name, r.goal 
      FROM routines as r JOIN users as u ON u.id=r."creatorId" 
      WHERE u.username='${username}';
    `);
    return rows;
  } catch (error) {
    console.error(error);
  }
}

async function getPublicRoutinesByUser({ username }) {
  try {
    const { rows } = await client.query(`
      SELECT r.id, r."creatorId", r."isPublic", r.name, r.goal 
      FROM routines as r JOIN users as u ON u.id=r."creatorId" 
      WHERE u.username='${username}' and r."isPublic"= true;
    `);
    return rows;
  } catch (error) {
    console.error(error);
  }
}

async function getPublicRoutinesByActivity({ id }) {
  try {
    const { rows } = await client.query(`
      SELECT r.id, r."creatorId", r."isPublic", r.name, r.goal 
      FROM routines as r JOIN routine_activities as ra ON r.id = ra."routineId"
      JOIN activities as a ON a.id=ra."activityId" 
      WHERE a.id=${id} ;
    `);
    return rows;
  } catch (error) {
    console.error(error);
  }
}

async function updateRoutine({ id, ...fields }) {}

async function destroyRoutine(id) {}

module.exports = {
  getRoutineById,
  getRoutinesWithoutActivities,
  getAllRoutines,
  getAllPublicRoutines,
  getAllRoutinesByUser,
  getPublicRoutinesByUser,
  getPublicRoutinesByActivity,
  createRoutine,
  updateRoutine,
  destroyRoutine,
};
