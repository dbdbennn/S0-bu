import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <h1>STUDY-0</h1>
        <div class="core">
          <div class="img1">
            <img src="img/g1.png"/>
            <img src="img/b1.png"/>
          </div>
          <div class="btns">
            <div class="btn"><button class="btn_signIn" onclick="location.href='./signIn.html'">sign in</button></div>
            <div class="btn"><button class="btn_signUp" onclick="location.href='./signUp.html'">sign up</button></div>
          </div>
          <div class="img2">
            <img src="img/b2.png"/>
            <img src="img/g2.png"/>
        </div>
      </div>
    </div>
  );
}

export default App;
