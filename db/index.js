module.exports = {
  // what does the comment directly below mean?
  // ...require('./client'), // adds key/values from users.js ---> umm... really?
  ...require('./users'), // adds key/values from users.js
  ...require('./activities'), // adds key/values from activites.js
  ...require('./routines'), // etc
  ...require('./routine_activities') // etc
}