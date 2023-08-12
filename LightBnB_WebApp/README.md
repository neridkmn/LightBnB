# LightBnB
 A simple multi-page Airbnb clone that uses a server-side JavaScript to display the information from queries to web pages via SQL queries. 

# Getting Started
* [Create](https://github.com/neridkmn/LightBnB) a new repository using this repository as a template.
* Clone your repository onto your local device.
* Install dependencies using the npm install command.
* Start the web server using the `npm run local` command. The app will be served at http://localhost:3000/.
* Go to http://localhost:3000/ in your browser.

* # Create Database Locally
* Using `psql` command in terminal (in the project folder), enter the psql command line.
* Run `CREATE DATABASE lightbnb`
* Run `\c lightbnb`
* Run `\i migrations/01_schema.sql`
* Run `\i seeds/02_seeds.sql`

## Final Product 
App walkthrough
* Login as existing user
* Browse existing reservations
* Search with criteria and get appropriate results
* Create a new listing
* Sign up as a new user

https://github.com/neridkmn/LightBnB/assets/128938408/d6347176-fb57-4750-8c75-cb7fc4ad688e



Dependencies:
* Bcrypt
* Cookie-session
* Express
* Nodemon
* Pg

Project Outcomes:
* Design the database and create an ERD for the tables.
* Create the database and the tables using the ERD.
* Add fake data to the database to make testing queries easier.
* Write queries.
* Connect the database to a JavaScript application in order to interact with the data from a web page.
  
### Project Structure

```
.
├── db
│   ├── json
│   └── database.js
├── public
│   ├── javascript
│   │   ├── components 
│   │   │   ├── header.js
│   │   │   ├── login_form.js
│   │   │   ├── new_property_form.js
│   │   │   ├── property_listing.js
│   │   │   ├── property_listings.js
│   │   │   ├── search_form.js
│   │   │   └── signup_form.js
│   │   ├── libraries
│   │   ├── index.js
│   │   ├── network.js
│   │   └── views_manager.js
│   ├── styles
│   │   ├── main.css
│   │   └── main.css.map
│   └── index.html
├── routes
│   ├── apiRoutes.js
│   └── userRoutes.js
├── styles  
│   ├── _forms.scss
│   ├── _header.scss
│   ├── _property-listings.scss
│   └── main.scss
├── .gitignore
├── package-lock.json
├── package.json
├── README.md
└── server.js
```

* `db` contains all the database interaction code.
  * `json` is a directory that contains a bunch of dummy data in `.json` files.
  * `database.js` is responsible for all queries to the database. It doesn't currently connect to any database, all it does is return data from `.json` files.
* `public` contains all of the HTML, CSS, and client side JavaScript. 
  * `index.html` is the entry point to the application. It's the only html page because this is a single page application.
  * `javascript` contains all of the client side javascript files.
    * `index.js` starts up the application by rendering the listings.
    * `network.js` manages all ajax requests to the server.
    * `views_manager.js` manages which components appear on screen.
    * `components` contains all of the individual html components. They are all created using jQuery.
* `routes` contains the router files which are responsible for any HTTP requests to `/users/something` or `/api/something`. 
* `styles` contains all of the sass files. 
* `server.js` is the entry point to the application. This connects the routes to the database.
