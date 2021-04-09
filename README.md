# GoodMovies

![GoodMovieDetailPage](https://user-images.githubusercontent.com/74742629/114240701-efd64900-9955-11eb-8caa-d01c9d3706be.png)


## Summary

[GoodMovies](https://good-movies-js.herokuapp.com/) is a single-page web application based on Good Reads using Javascript, Express, and PostgresSQL. Good Movies allows users to:

* Create an account
* Log in / Log out
* Create custom movie lists
* Edit movie list names
* Delete movie lists
* Rate movies
* Leave reviews for movies
* Search for movies based on a keyword
* See a paginated view of each of the 900+ movies in the database

## Overall Structure

#### Back end
The application was built using Javascript with a postgreSQL database and PUG templating. Backend structure is RESTful and all data requests use AJAX and are fullfilled with a mixture of a JSON API and PUG rendering.

#### Front end 
The front end is built using PUG templates, CSS, and DOM maninuplation. Vanilla JS was used where possible to minimize page reloading.


#### Libraries

Good Reads uses:
- express
  - express session
  - express validator
- sequelize
- bcrypt
- pug

## Primary Components

#### User Authorization
User authorization is handled in JavaScript using BCrypt for password hashing. These hashed passwords are saved to the database instead of the plain-text passwords. Upon login, the password that a user enters is rehashed and checked against the hashed password in the database to verify credentials.

