const testText = document.querySelector('.test-text');

const socket = io();

socket.on('update-text', (data) => {
    testText.innerHTML = data;
});