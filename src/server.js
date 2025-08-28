const express = require('express'); // Imports the express server module
const app = express(); // Creates an express application
const http = require('http'); // Imports the http module
const server = http.createServer(app); // Creates an HTTP server
const path = require('path'); // Imports the path module
const { Server } = require('socket.io'); // Imports the socket.io module


app.use(express.static(path.join(__dirname, '..', 'public'))); // Serves static files from the public directory

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html')); // Sends the index.html file as a response
  });

app.get('/screen', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'screen.html')); // Sends the screen.html file as a response
  });

app.get('/gamemaster', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'gamemaster.html')); // Sends the gamemaster.html file as a response
  });

server.listen(3000, () => { // Starts the server on port 3000
  console.log('now running at http://localhost:3000'); // Logs a message to the console
});

// socket.io initiation
const io = new Server(server, {
  cors: {
    origin: '*',
  }
});


// DATA

  const users = [];

  const rooms = [
    {
      name: "room1",
      users: [],
      maxUsers: 2,
      available: true,
    },
    {
      name: "room2",
      users: [],
      maxUsers: 2,
      available: true,
    }
  ];


  const role1Actions = ["role1-walk", "role1-talk"];
  const role2Actions = ["role2-walk", "role2-talk"];
  const role3Actions = ["role3-walk", "role3-talk"];




// FUNCTIONS

  // creating and adding user object to users array
  function createUser(socketId) {
    //console.log("user array before user added: " , users);
    users[socketId] = {
      id: socketId,
      name: "",
      room: "",
      talking: false,
      role: "",
      roleActions: [],
      hasRole: false,
      currentInstruction: "",
    }
    //console.log("user array with user added: " , users);
  }

  function assignRole(socketId, role) {
    if (role === "role1") {
      users[socketId].role = role;
      users[socketId].roleActions = role1Actions;
      users[socketId].hasRole = true;
    } else if (role === "role2") {
      users[socketId].role = role;
      users[socketId].roleActions = role2Actions;
      users[socketId].hasRole = true;
    } else if (role === "role3") {
      users[socketId].role = role;
      users[socketId].roleActions = role3Actions;
      users[socketId].hasRole = true;
    }
    console.log("user role assigned: " + users[socketId].role);
  }

  // removing user object from users array
  function removeUser(socketId) {
    delete users[socketId];
    console.log("user array with user removed: " , users);
  }

  function getRandomFromArray(array) {
    console.log("array: " + array);
    return array[Math.floor(Math.random() * array.length)];
  }





// SOCKET.IO 

  io.on('connection', function(socket) { // When a client connects to the server
      console.log('a user connected:' + socket.id); // Logs a message to the console
      
      socket.on('disconnect', function() { // When a client disconnects from the server
          console.log('user disconnected: ' + socket.id); // Logs a message to the console

          rooms.forEach((room) => { // Iterates through the rooms array

            if (room.users.includes(users[socket.id])) { // Checks if the user is in a room
              room.users.splice(room.users.indexOf(users[socket.id]), 1); // Removes the user from the room

              if (room.users.length < 2) { // Checks if the room has less than 2 users
                room.available = true; // Sets the room to available
              }

            console.log(room);
            }

            removeUser(socket.id); // Removes the user from the users object
            

          });

      });

      socket.on('role-chosen', function(data) {
        console.log("role chosen: " + data);
        createUser(socket.id);
        assignRole(socket.id, data);
      });


      socket.on('next-GM-instruction', function() {
        io.emit("time-for-next-instruction");
      });


      socket.on("getInstruction", function() {
        if(!users[socket.id]){
          return;
        }
        if(!users[socket.id].hasRole){
          return;
        }
        let roleActions = users[socket.id].roleActions; // get the roleActions array from the user object
        let instruction = getRandomFromArray(roleActions); // get a random instruction from the roleActions array
        
        if(users[socket.id].currentInstruction === instruction){ // if the instruction is the same as the last one
          roleActions = roleActions.filter((action) => action !== instruction); // remove the instruction from the roleActions array
          instruction = getRandomFromArray(roleActions); // get a new random instruction
        } 
 
        socket.emit("next-instruction", instruction);
        users[socket.id].currentInstruction = instruction; // set instruction to currentInstruction in user object
        
      });
      
      
  });

