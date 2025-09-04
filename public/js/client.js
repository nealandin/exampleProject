const socket = io();

// html elements
const titleText = document.querySelector('.title-text');
const instructionText = document.querySelector('#instruction-text');
const joinRoomButton = document.getElementById('join-room');
const roleButtons = document.getElementsByClassName("role-button");

socket.on('disconnecting', function() {
    location.reload();
});

// socket events sent from server
socket.on('next-instruction', function(data) { // Listens for the 'next-instruction' event from the server
    titleText.style.display = "none";
    instructionText.innerHTML = data; // Updates the text content of the instructionText element
});


for(let i = 0; i < roleButtons.length; i++){
    const button = roleButtons[i];
    button.addEventListener('click', function() { 
        const role = button.id;
        socket.emit('role-chosen', role); 
        for(let i = 0; i < roleButtons.length; i++){
            roleButtons[i].style.display = 'none'; // hides the button
        }
        titleText.innerHTML = "YOU ARE AT THE GRAVEYARD"; // updates the title text
    });
}


