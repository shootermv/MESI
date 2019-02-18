# MESI - Project Management Tool
[![Build Status](https://travis-ci.org/shootermv/MESI.svg?branch=master)](https://travis-ci.org/shootermv/MESI.svg?branch=master)  
Example application built with nodejs + angularjs + mongodb .

[demo](http://mesi-tasks.herokuapp.com/)

Usecases - 
  - Team leader can split the project to the tasks and share them among the programmers.
  - Each programmer can notify about his progress on the tasks at real time.
  - Each programmer gets task immediately after it was assigned to him.
  - You can use it to manage your team of programmers.

## Authentication
Mesi contains user authentication implementation with "Admin" and "User" roles.
Admin - for a team leader and User - for  programmer.

Team leader can create tasks and drag them to programmer earea - to assign the task to the programmer.
Programmers can notify their progress by changing the status of the task (by clicking on status label):

* `new`
* `active` - the task programmer is currently working on (will appear blue at Admin's dashboard)
* `completed`
 
## Stack

* Persistence store: [MongoDB](http://www.mongodb.org/)
* Backend: [Node.js](http://nodejs.org/)
* Awesome [AngularJS](http://www.angularjs.org/) on the client
* CSS based on [Twitter's bootstrap](http://twitter.github.com/bootstrap/)

### Setup Develop Environment
* (You should have node and Mongodb nistalled and running)
* clone project `git clone https://github.com/shootermv/MESI.git`
* run npm install
* (to inistialize the DB) run `node server/initDB`
* run  `npm start`

Then navigate your browser to `http://localhost:8000/` to see the app running in
your browser.



### Running unit tests

* run `npm test` for get karma tests running 

