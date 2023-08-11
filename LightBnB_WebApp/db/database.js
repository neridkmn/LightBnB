const properties = require("./json/properties.json");
const users = require("./json/users.json");

const { Pool } = require('pg'); //Database connection

const pool = new Pool({
  user: 'neriman',
  password: '123',
  host: 'localhost',
  database: 'lightbnb'
});

/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function(email) { // refactored function. Accepts an email address and will return a promise
  return pool.query(`SELECT * FROM users WHERE email = $1`, [email.toLowerCase()]) // To limit for 1 user I used WHERE. The query get the user's email from $1 and it replaces the email with the 2nd argument of the pool.query function. 
    .then(res => {
      const user = res.rows[0] ? res.rows[0] : null; //the promise resolve with a user object(the line below) with the given email address(res.row[0]), or null if that user does not exist.
      return Promise.resolve(user);
    })
    .catch((err) => {
      console.log(err.message);
    });
};

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function(id) { //refactored function. Accepts an id and will return a promise
  return pool.query(`SELECT * FROM users WHERE id = $1`, [id]) // To limit for 1 user I used WHERE. The query get the user's id from $1 and it replaces the id with the 2nd argument of the pool.query function. 
    .then(res => {
      const user = res.rows[0] ? res.rows[0] : null; //the promise resolve with a user object(the line below) with the given id(res.row[0]), or null if that user does not exist.
      return Promise.resolve(user);
    })
    .catch((err) => {
      console.log(err.message);
    });
};

/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser = function(user) { //refactored function. Accepts a user object that will have a name, email, and password property.
  return pool.query(`INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *;`, [user.name, user.email.toLowerCase(), user.password])
    .then(res => {
      const user = res.rows[0] ? res.rows[0] : null;
      return Promise.resolve(user);
    })
    .catch((err) => {
      console.log(err.message);
    });
};

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guest_id, limit = 10) { //refactored function.

  const queryString = `SELECT reservations.*, properties.*
  FROM reservations
  JOIN properties ON reservations.property_id = properties.id
  JOIN property_reviews ON properties.id = property_reviews.property_id
  WHERE reservations.guest_id = $1
  GROUP BY properties.id, reservations.id
  ORDER BY reservations.start_date
  LIMIT $2;`;

  return pool
    .query(queryString, [guest_id, limit])
    .then(res => {
      return Promise.resolve(res.rows);
    })
    .catch((err) => {
      console.log(err.message);
    });
};

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */

const getAllProperties = (options, limit = 10) => { //Refactored function

  const queryParams = [];
  let hasMinimumRating = false; // Declare a Boolean to false to keep track of whether minimum rating has been provided

  let queryString = `
  SELECT properties.*, avg(property_reviews.rating) as average_rating
  FROM properties
  JOIN property_reviews ON properties.id = property_id
  `;

  if (options.city) {
    queryParams.push(`%${options.city}%`);
    queryString += `WHERE city LIKE $${queryParams.length} `;
  }

  if (options.owner_id) { //if an owner_id is passed in, only return properties belonging to that owner.
    queryParams.push(`${options.owner_id}`); //Add owner_id to queryParams array.
    queryString += `${queryParams.length > 1 ? "AND" : "WHERE"} owner_id IS $${queryParams.length} `; //If the queryParams has more than 1 element, add 'AND'before the next query if not add WHERE.  
  }

  if (options.minimum_price_per_night && options.maximum_price_per_night) { //if a minimum_price_per_night and a maximum_price_per_night, only return properties within that price range.
    queryParams.push(`${options.minimum_price_per_night * 100}`, `${options.maximum_price_per_night * 100}`); //Add min & max price to the queryParams array.
    queryString += `${queryParams.length > 2 ? "AND" : "WHERE"} cost_per_night BETWEEN $${queryParams.length - 1} AND $${queryParams.length} `; //If the queryParams has more than 2 elements, add 'AND'before the next query if not add WHERE.
  }

  if (options.minimum_rating) { //if a minimum_rating is passed in, only return properties with an average rating equal to or higher than that.
    queryParams.push(`${options.minimum_rating}`); //add rating to the quaryParams array
    hasMinimumRating = true; // Return Boolean as true
  }

  queryParams.push(limit);
  // Line 135 - add Having query for the rating
  queryString += `
  GROUP BY properties.id
  ${hasMinimumRating ? `HAVING avg(property_reviews.rating) >= $${queryParams.length - 1}` : ""} 
  ORDER BY cost_per_night
  LIMIT $${queryParams.length};
  `;

  console.log(queryString, queryParams);


  return pool.query(queryString, queryParams).then((res) => res.rows);
};

/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {
  const propertyId = Object.keys(properties).length + 1;
  property.id = propertyId;
  properties[propertyId] = property;
  return Promise.resolve(property);
};

module.exports = {
  getUserWithEmail,
  getUserWithId,
  addUser,
  getAllReservations,
  getAllProperties,
  addProperty,
};
