const client = require('./client');
const bcrypt = require('bcrypt');

// database functions

// user functions
async function createUser({ username, password }) {
  const SALT_COUNT = 10;
  const hashedPassword = await bcrypt.hash(password, SALT_COUNT);
  
  const {
    rows: [user],
  } = await client.query(
    `
    INSERT INTO 
      users(username, password)
    VALUES
      ($1, $2)
    ON CONFLICT 
      (username) DO NOTHING
    RETURNING *;
    
    `,
    [username, hashedPassword]
  );

  return user;
}

async function getUser({ username, password }) {
  const {
    rows: [user],
  } = await client.query(
    `
    SELECT *
    FROM users
    WHERE "username"=$1


  `[username]
  );

  if (!user) {
    throw new Error('No user found');
  }

  if (await bcrypt.compare(user.password, password)) {
    return user;
  } else {
    throw new Error('Incorrect password');
  }
}

async function getUserById(userId) {}

async function getUserByUsername(userName) {}

module.exports = {
  createUser,
  getUser,
  getUserById,
  getUserByUsername,
};
