const socket = new WebSocket("ws://localhost:3000");

socket.addEventListener("open", (event) => {
    socket.send("Hello server!");
});

socket.addEventListener("message", (event) => {
    console.log("Message from server: ", event.data);
});

socket.addEventListener("end", () => {
    console.log("Disconnected from server");
});

socket.addEventListener("error", (event) => {
    console.error("WebSocket error observed:", event);
});
