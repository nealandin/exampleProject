const socket = io();

const nextButton = document.getElementById('next-button');

nextButton.addEventListener('click', () => {
    console.log("next button clicked");
    socket.emit('next-GM-instruction', 'room1');
});