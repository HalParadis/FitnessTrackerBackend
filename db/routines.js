const client = require("./client");

async function createRoutine({ creatorId, isPublic, name, goal }) {
  const {rows: [routine]} = await client.query(`
    INSERT INTO 
      routines("creatorId", "isPublic", name, goal)
    VALUES
      ($1, $2, $3, $4)
    ON CONFLICT 
      (name) DO NOTHING
    RETURNING *;
  `, [creatorId, isPublic, name, goal]);

  return routine;
}

async function getRoutineById(id) {
  const {rows: [routine]} = await client.query(`
    SELECT * 
    FROM 
      routines
    WHERE
      id=$1;
  `, [id]);
  return routine;
}

async function getRoutinesWithoutActivities() {
  const {rows: routines} = await client.query(`
    SELECT * FROM routines;
  `);
  return routines;
}

async function getAllRoutines() {
  const { rows: routines } = await client.query(`
    SELECT 
      r.*, u.username AS "creatorName" 
    FROM 
      routines AS r
    JOIN 
      users AS u 
    ON 
      u.id = r."creatorId"
    JOIN 
      (
        SELECT
          a.*, ra.id AS "routineActivityId", ra."routineId",
          ra.duration, ra.count
        FROM 
          activities AS a
        JOIN
          routines_activities AS ra
        ON
          ra."activityId" = a.id
      ) AS activities
    ON 
      activities."routineId" = r.id;
  `)
  return routines;
}

async function getAllPublicRoutines() {}

async function getAllRoutinesByUser({ username }) {}

async function getPublicRoutinesByUser({ username }) {}

async function getPublicRoutinesByActivity({ id }) {}

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
