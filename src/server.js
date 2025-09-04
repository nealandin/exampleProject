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

  const users = {};

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

  // crab
  let crabActions = ["Snap your fingers to the rhythm of an ABBA song", "SAY: Hello, what a crabbie day", "SAY: I’m hungry, I need fresh bodies","SAY: Would it be creepy to dig deep","SAY: Do you wanna learn the crab dance? It’s a ritual from my ancestors", "Walk sideways to the centre of the room", "Walk sideways to the centre of the room", "Roll your eyes", "Pinch someone gently on the shoulder", "Shake yourself", "Do a mating dance for 10 seconds", "Jump awkwardly"];
 
  // turtle
  let turtleActions = [ "Smash gravestones", "Digg up graves", "Pee", "Place a curse on the other players", "Retract in to the shell", "Laugh evil", "Make zombies form dead people", "Open mind traps", "SAY: BOOO",  "SAY: Finally bloody silence! You guys make a great company.", "SAY: Rest in peace… NOT!!", "SAY: The dead and me, all cursed souls.", "SAY: The eternal screech, my favourite tune", "SAY: Where’s my seaweed?!", "SAY: Have you guys watched Franklin?" , "SAY: Where the scraps of my dinners rest."];

  // fish
  let fishActions = ["pay condolences", "flop around", "light a cigarette gesture", "heavy sigh", "look for clues", "cower in fear", "appreciate surroundings", "count to ten", "SAY: oh no no…that didn’t go so well", "SAY:  My therapist said that too", "SAY: I wonder what my therapist would think", "SAY: That seems fishy", "SAY: As my therapist said, just keep swimming!", "SAY: so sad", "SAY: I do not feel well", "SAY: What does your therapist say?", "SAY: I agree", "SAY: Such a cloudy day", "SAY: Ahh", "SAY: Phu", "SAY: Excuse me, can I sit here", "SAY: I wonder if it will be rainy tomorrow?", "SAY: I feel you"];


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
    if (role === "crab") {
      users[socketId].role = role;
      users[socketId].roleActions = crabActions;
      users[socketId].hasRole = true;
    } else if (role === "turtle") {
      users[socketId].role = role;
      users[socketId].roleActions = turtleActions;
      users[socketId].hasRole = true;
    } else if (role === "fish") {
      users[socketId].role = role;
      users[socketId].roleActions = fishActions;
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
        Object.values(users).forEach((user) => {
          sendInstruction(user.id);
        });
      });


      function sendInstruction(socketId) {
        console.log("socketId: " + socketId);
        if(!users[socketId]){
          return;
        }
        if(!users[socketId].hasRole){
          return;
        }
        let roleActions = users[socketId].roleActions; // get the roleActions array from the user object
        let instruction = getRandomFromArray(roleActions); // get a random instruction from the roleActions array
        
        if(users[socketId].currentInstruction === instruction){ // if the instruction is the same as the last one
          roleActions = roleActions.filter((action) => action !== instruction); // remove the instruction from the roleActions array
          instruction = getRandomFromArray(roleActions); // get a new random instruction
        } 
 
        io.to(socketId).emit("next-instruction", instruction);
        users[socketId].currentInstruction = instruction; // set instruction to currentInstruction in user object
        
      }
      
      
  });

