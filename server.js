const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

let sharedText = "";

io.on("connection", (socket) => {
  socket.emit("text", sharedText); // new user gets current state
  io.emit("users", io.engine.clientsCount); // update user count for everyone

  socket.on("text", (t) => {
    sharedText = t;
    socket.broadcast.emit("text", t); // send to the other user(s)
  });

  socket.on("disconnect", () => {
    io.emit("users", io.engine.clientsCount);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Running on http://localhost:${PORT}`));
