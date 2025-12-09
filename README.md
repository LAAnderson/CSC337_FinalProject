# CSC Games
A full-stack website with multiple modules, session management, data persistence, user authentication, and CSS styling.

This is a Node.js web application built using Express. 
Follow the steps below to install dependencies and run the project.
1. Install required packages:
```
  npm install express &
  npm install path &
  npm install mongodb &
  npm install crypto
```

2. Install [MongoSH](https://www.mongodb.com/docs/mongodb-shell/)
   
3. In the project directory, run
```
    mongoimport --db videogamestore --collection games --type json --file games.json
```

4. Start the server:
node server.js
The application will run at http://localhost:8080/
