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

// Firebase 초기화 및 Firestore 가져오기
const admin = require('firebase-admin');
const serviceAccount = require('../../study-0-c5302-firebase-adminsdk-w31t0-a72b9187d1.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();

app.use(express.static(__dirname + '/public'));

io.on('connection', (socket) => {
  console.log('a user connected');

  // Firestore 문서 참조 변수
  let studyroomRef;

  socket.on('disconnect', () => {
    console.log('user disconnected');

    if (studyroomRef) {
      // Firebase Firestore에서 해당 필드 제거
      studyroomRef.update({ email: admin.firestore.FieldValue.delete() })
        .then(() => {
          console.log('User email removed from Firestore');
        })
        .catch((error) => {
          console.error('Error removing user email from Firestore:', error);
        });
    }
  });

  socket.on('userConnected', (userInfo) => {
    console.log('Received user information:', userInfo);

    // Firebase Authentication에서 저장된 이메일 가져오기
    const userEmail = userInfo.email;
    console.log('User email:', userEmail);

    // 페이지 경로 가져오기
    const pagePath = userInfo.pagePath;
    console.log('Page path:', pagePath);

    // Firestore에 문서 생성 또는 가져오기
    studyroomRef = db.collection('studyroom').doc(pagePath);
    studyroomRef.get()
      .then((doc) => {
        if (doc.exists) {
          // 문서가 이미 존재하는 경우, 이메일 필드 업데이트
          studyroomRef.update({ email: userEmail })
            .then(() => {
              console.log('User email updated in Firestore');
            })
            .catch((error) => {
              console.error('Error updating user email:', error);
            });
        } else {
          // 문서가 존재하지 않는 경우, 새로운 문서 생성 및 이메일 필드 저장
          studyroomRef.set({ email: userEmail })
            .then(() => {
              console.log('User email saved in Firestore');
            })
            .catch((error) => {
              console.error('Error saving user email:', error);
            });
        }
      })
      .catch((error) => {
        console.error('Error getting studyroom document:', error);
      });

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
