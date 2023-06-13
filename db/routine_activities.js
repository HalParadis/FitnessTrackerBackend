const client = require("./client");

async function addActivityToRoutine({
  routineId,
  activityId,
  count,
  duration,
}) {
  const {rows: [routine_activity]} = await client.query(`
    INSERT INTO 
      routines_activities("routineId", "activityId", count, duration)
    VALUES
      ($1, $2, $3, $4)
    ON CONFLICT 
      ("routineId", "activityId") DO NOTHING
    RETURNING *;
  `, [routineId, activityId, count, duration]);

  return routine_activity;
}

async function getRoutineActivityById(id) {
  const {rows: [routineActivity]} = await client.query(`
    SELECT *
    FROM 
      routines_activities
    WHERE
      id=$1;
  `, [id]);
  return routineActivity;
}

async function getRoutineActivitiesByRoutine({ id }) {
  const {rows: routineActivities} = await client.query(`
    SELECT *
    FROM 
      routines_activities
    WHERE
      "routineId"=$1;
`, [id]);

return routineActivities;
}

async function updateRoutineActivity({ id, ...fields }) {
  const setString = Object.keys(fields).map(
    (key, index) => `"${key}"=$${index + 1}`
  ).join(', ');

  if (setString.length === 0) return;

  const {rows: [routineActivity]} = await client.query(`
    UPDATE routines_activities 
    SET ${setString}
    WHERE id=${id}
    RETURNING *;
  `, [...Object.values(fields)]);

  return routineActivity;
}

async function destroyRoutineActivity(id) {
  const {rows: [routineActivity]} = await client.query(`
    DELETE FROM 
      routines_activities
    WHERE
      id=$1
    RETURNING *;
  `, [id]);

  return routineActivity;
}

async function canEditRoutineActivity(routineActivityId, userId) {
  const {rows: [{routineId}]} = await client.query(`
    SELECT "routineId"
    FROM 
      routines_activities
    WHERE
      id=$1;
  `, [routineActivityId]);

  const {rows: [{creatorId}]} = await client.query(`
    SELECT "creatorId"
    FROM
      routines
    WHERE
      id=$1;
  `, [routineId]);

  return creatorId == userId;
}

module.exports = {
  getRoutineActivityById,
  addActivityToRoutine,
  getRoutineActivitiesByRoutine,
  updateRoutineActivity,
  destroyRoutineActivity,
  canEditRoutineActivity,
};
