Bear Necessities
================

Simple REST API to show the bare necessities required of most web APIs (Create, Retrieve, Update, Delete).

##### Technologies used
* PostgreSQL
* Node.js
* Express.js

Modules:
* pg
* body-parser

##### Usage
1. Start a PostgreSQL instance and point the pgConnection (app.js:line_7) variable to the database of your choosing with the correct authentication.
2. Create a table called `bears` with the columns `(bear_id, bear_name, bear_type)` where bear_id is a primary key and bear_name and bear_type are varchar.
3. Have Node.js and npm installed on your machine.
4. Run `npm install` then `node app.js` in the main project directory.

##### HTTP methods supported
GET:
no body data -> http://address:port/api/bears
no body data -> http://address:port/api/bears/:bear_id

POST:
{
    bear_name : 'Christopher'
    bear_type : 'Polar'
}
->
http://address:port/api/bears

PUT:
{
    bear_name : 'Chris'
}
->
http://address:port/api/bears/:bear_id

DELETE:
no body data -> http://address:port/api/bears/:bear_id
