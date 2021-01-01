import './App.css';
import Signin from './pages/Signin';
import Signup from './pages/Signup';
import Signout from './pages/Signout';
import Home from './pages/Home';
import ActiveAccount from './pages/ActiveAccount';
import ForgetPassword from './pages/ForgetPassword';
import {BrowserRouter as Router,  Switch,  Route} from "react-router-dom";
import React from 'react'
import HistoryBox from './components/HistoryBox';
import Profile from './components/Profile';
import AnotherProfile from './components/AnotherProfile';
function App() {
  
  return(
      <Router>
        <Switch>
          <Route exact path="/signin">
            <Signin />
          </Route>
          <Route exact path="/signup">
            <Signup />
          </Route>
          <Route exact path="/signout">
            <Signout />
          </Route>
          <Route exact path="/account/activate/:token">
            <ActiveAccount/>
          </Route>
          <Route exact path="/forget-password">
            <ForgetPassword/>
          </Route>
          <Route exact path="/htr">
            <HistoryBox/>
          </Route>
          <Route exact path="/profile">
            <Profile />
          </Route>
          <Route exact path="/user/:id">
            <AnotherProfile />
          </Route>
          <Route path="/">
            <Home/>
          </Route>
        </Switch>
      </Router>
)};
export default App;
