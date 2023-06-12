const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

app.use(express.static(__dirname + '/public'));

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  socket.on('userConnected', (userInfo) => {
    console.log('Received user information:', userInfo);

    // Firebase Authentication에서 저장된 이메일 가져오기
    const userEmail = userInfo.email;
    console.log('User email:', userEmail);

    // 현재 접속 중인 모든 클라이언트에게 이메일 정보 전달
    io.emit('userEmail', userEmail);
  });

  socket.on('getUserInfo', (socketId) => {
    console.log(socketId);
  });
});

server.listen(4000, () => {
  console.log('listening on *:4000');
});
