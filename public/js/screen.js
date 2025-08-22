const socket = io();

socket.on("messageToScreen", (data) => {
    const newScreenText = document.createElement("p");
    newScreenText.innerHTML = data;
    newScreenText.classList.add("body-text");
    newScreenText.id = "screen-text";
    document.getElementById("screen-text-container").appendChild(newScreenText);
})