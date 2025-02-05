const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// Firebase 문서 참조 변수
let studyroomRefs = [];

// Firebase 초기화 및 Firestore 가져오기
const admin = require("firebase-admin");
const serviceAccount = require("./study-0-c5302-firebase-adminsdk-w31t0-a72b9187d1.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const db = admin.firestore();

app.use(express.static(__dirname + "/public"));

io.on("connection", (socket) => {
  console.log("a user connected");

  // 연결 해제 시 실행되는 이벤트 핸들러
  socket.on("disconnect", () => {
    console.log("user disconnected");
  
    if (socket.userUID && studyroomRefs.length > 0) {
      const userUID = socket.userUID;
  
      studyroomRefs.forEach((studyroomRef, index) => {
        // Firebase Firestore에서 해당 UID 제거
        studyroomRef
          .update({
            uids: admin.firestore.FieldValue.arrayRemove(userUID),
          })
          .then(() => {
            console.log("User uid removed from Firestore");
            studyroomRefs.splice(index, 1); // 배열에서 참조 제거
          })
          .catch((error) => {
            console.error("Error removing user uid from Firestore:", error);
          });
      });
    }
  });
  

  socket.on("userConnected", (userInfo) => {
    console.log("Received user information:", userInfo);

    // Firebase Authentication에서 저장된 이메일 가져오기
    const userUID = userInfo.uid;
    console.log("User uid:", userUID);

    // 소켓에 userUID 속성으로 저장
    socket.userUID = userUID;

    const userRoomID = userInfo.roomID;
    console.log("roomID", userRoomID);

    socket.userRoomID = userRoomID;


    // Firestore에 문서 생성 또는 가져오기
    if (!userRoomID || userRoomID.trim() === "") {
      console.error("Invalid userRoomID:", userRoomID);
      return;
    }
    
    const studyroomRef = db.collection("studyroom").doc(userRoomID);
    studyroomRefs.push(studyroomRef); // 배열에 참조 추가
    studyroomRef
      .get()
      .then((doc) => {
        if (doc.exists) {
          // 문서가 이미 존재하는 경우, 이메일 필드 업데이트
          studyroomRef
            .update({ uids: admin.firestore.FieldValue.arrayUnion(userUID) })
            .then(() => {
              console.log("User uid updated in Firestore");
            })
            .catch((error) => {
              console.error("Error updating user uid:", error);
            });
        } else {
          // 문서가 존재하지 않는 경우, 새로운 문서 생성 및 이메일 필드 저장
          studyroomRef
            .set({ uids: [userUID] })
            .then(() => {
              console.log("User uid saved in Firestore");
            })
            .catch((error) => {
              console.error("Error saving user uid:", error);
            });
        }
      })
      .catch((error) => {
        console.error("Error getting studyroom document:", error);
      });

    io.emit("userUID", userUID);

    // 현재 저장된 모든 사용자 정보 가져오기
    if (studyroomRefs.length > 0) {
      const allUsers = [];
      studyroomRefs.forEach((studyroomRef) => {
        studyroomRef
          .get()
          .then((doc) => {
            if (doc.exists) {
              const users = doc.data().uids || []; // users가 undefined인 경우 빈 배열로 초기화
              allUsers.push(...users);
            }

            // 중복 제거 후 현재 사용자에게 모든 사용자 정보 전달
            const uniqueUsers = [...new Set(allUsers)];
            socket.emit("allUsers", uniqueUsers);
          })
          .catch((error) => {
            console.error("Error getting studyroom document:", error);
          });
      });
    }
  });

  socket.on("getUserInfo", (socketId) => {
    console.log(socketId);
  });
});

server.listen(4000, () => {
  console.log("listening on *:4000");
});