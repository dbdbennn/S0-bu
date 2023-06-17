import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Community from './community';
import Study from './study';

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Community} />
        <Route path="/study/:roomID" component={Study} />
      </Switch>
    </Router>
  );
}

export default App;
