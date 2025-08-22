const socket = io();

// html elements
const testText = document.querySelector('#test-text');
const joinRoomButton = document.getElementById('join-room');


// socket events sent from server
socket.on('next-instruction', (data) => { // Listens for the 'next-instruction' event from the server
    testText.innerHTML = data; // Updates the text content of the testText element
});

// page event listeners
joinRoomButton.addEventListener('click', () => { // Adds a click event listener to the joinRoomButton element
    socket.emit('join-room', 'room1'); // Sends a 'join-room' event to the server
    joinRoomButton.disabled = true; // Disables the joinRoomButton 
    joinRoomButton.style.display = 'none'; // Hides the joinRoomButton 
});
