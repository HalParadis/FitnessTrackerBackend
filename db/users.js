const client = require('./client');
const bcrypt = require('bcrypt');

// database functions

// user functions
async function createUser({ username, password }) {
  const SALT_COUNT = 10;
  const hashedPassword = await bcrypt.hash(password, SALT_COUNT);

  const { rows: [user] } = await client.query(`
    INSERT INTO 
      users(username, password)
    VALUES
      ($1, $2)
    ON CONFLICT 
      (username) DO NOTHING
    RETURNING *;
    `, [username, hashedPassword]);

  delete user.password;
  return user;
}

async function getUser({ username, password }) {
  
  const user = await getUserByUsername(username);

  if (!user) {
    throw new Error('No user found');
  }

  const hashedPassword = user.password;
  const passwordsMatch = await bcrypt.compare(password, hashedPassword);
    
  if (passwordsMatch) {
    delete user.password;
    return user;
  }
}

async function getUserById(userId) {
  const { rows: [user] } = await client.query(`
    SELECT *
    FROM users
    WHERE id=$1;
  `, [userId]);

  delete user.password;
  return user;
}

async function getUserByUsername(userName) { 
  const { rows: [user] } = await client.query(`
    SELECT *
    FROM users
    WHERE "username"=$1;
  `, [userName]);

  return user;
}

module.exports = {
  createUser,
  getUser,
  getUserById,
  getUserByUsername,
};
