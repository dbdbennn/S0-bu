// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, doc, setDoc, deleteDoc } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAtsC52zBNvuSkjU7zuvTdErBDcwbF-3QQ",
  authDomain: "study-0-c5302.firebaseapp.com",
  databaseURL: "https://study-0-c5302-default-rtdb.firebaseio.com",
  projectId: "study-0-c5302",
  storageBucket: "study-0-c5302.appspot.com",
  messagingSenderId: "816317935442",
  appId: "1:816317935442:web:08d0855201cbd6a82bd48b",
  measurementId: "G-QTPMEEX0J5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

// 클라이언트 연결 이벤트 처리
io.on('connection', (socket) => {
  console.log('클라이언트가 연결되었습니다.');

  // 클라이언트가 로그인하고 roomID를 전달할 때
  socket.on('login', async ({ roomID, email }) => {
    try {
      // studyroom 컬렉션에서 해당 roomID 문서 가져오기
      const roomDocRef = doc(db, 'studyroom', roomID);

      // 해당 roomID 문서에 필드로 email 저장
      await setDoc(roomDocRef, { email }, { merge: true });
      
      console.log('email이 저장되었습니다.');
    } catch (error) {
      console.error('email 저장 중 오류가 발생했습니다:', error);
    }
  });

  // 클라이언트 연결 해제 이벤트 처리
  socket.on('disconnect', async () => {
    try {
      // 클라이언트의 roomID를 전달받아 해당 문서의 email 필드 삭제
      const roomID = socket.roomID;
      if (roomID) {
        const roomDocRef = doc(db, 'studyroom', roomID);
        await deleteDoc(roomDocRef);
        
        console.log('email이 삭제되었습니다.');
      }
    } catch (error) {
      console.error('email 삭제 중 오류가 발생했습니다:', error);
    }
  });
});

// 서버 시작
const port = 3000;
server.listen(port, () => {
  console.log(`Socket.io 서버가 포트 ${port}에서 실행 중입니다.`);
});
