import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 9200 });

wss.on("connection", function (socket) {
    console.log("Client connected");

    socket.on("message", (message) => {
        console.log("Received:", message.toString());
        const res="Server "+message.toString()
        socket.send(res);
        console.log("res send ",res)
    });
});