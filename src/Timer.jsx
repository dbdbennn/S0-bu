
import { useState, useEffect, useRef } from "react";
import { getFirestore, collection, addDoc } from "firebase/firestore";

// Firebase 초기화 및 Firestore 인스턴스 설정
const db = getFirestore();

function Timer() {
  const [time, setTime] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const timeRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime((prevTime) => {
        const seconds = prevTime.seconds + 1;
        const minutes = prevTime.minutes + Math.floor(seconds / 60);
        const hours = prevTime.hours + Math.floor(minutes / 60);
        return {
          hours: hours,
          minutes: minutes % 60,
          seconds: seconds % 60,
        };
      });
    }, 1000);

    return () => {
      clearInterval(timer);
      saveTimeToFirebase(timeRef.current); // 타이머 종료 시 Firebase에 시간 저장
    };
  }, []);

  async function saveTimeToFirebase(test) {
    try {
      const timeCollectionRef = collection(db, "times");
      const newTimeDocRef = await addDoc(timeCollectionRef, test);
      console.log("시간이 성공적으로 저장되었습니다. Document ID:", newTimeDocRef.id);
    } catch (error) {
      console.error("시간 저장 중 오류가 발생했습니다:", error);
    }
  }

  const handleStartTimer = () => {
    timeRef.current = time; // 현재 시간을 timeRef에 저장
    console.log("타이머가 시작되었습니다.");
  };

  return (
    <div>
      <p>타이머를 시작합니다.</p>
      <p>
        {time.hours < 10 ? "0" + time.hours : time.hours}:
        {time.minutes < 10 ? "0" + time.minutes : time.minutes}:
        {time.seconds < 10 ? "0" + time.seconds : time.seconds}
      </p>
      <button onClick={handleStartTimer}>지금 누른 버튼이 시간 저장됨...</button>
    </div>
  );
}

export default Timer;