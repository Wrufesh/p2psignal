const io = require("socket.io")();

const workspace = io.of(/^\/\w+$/);

workspace.on("connection", (socket) => {
  const workspace = socket.nsp;

  socket.broadcast.emit("new connection", {
    socketId: socket.id,
    userId: socket.userId,
  });

  workspace
    .to(socket.id)
    .emit("my id", { socketId: socket.id, userId: socket.userId });

  socket.on("disconnecting", () => {
    workspace.emit("new disconnection", { socketId: socket.id, userId: socket.userId });
  });
  // var room = io.sockets.adapter.rooms['my_room'];
});

workspace.on("disconnect", () => {
  // console.log('disconnected')
});

// this middleware will be assigned to each namespace
workspace.use((socket, next) => {
  socket.userId = socket.handshake.query.user;
  next();
});

io.listen(3000);

console.log("server is listning");
