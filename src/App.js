import './App.css';
import Signin from './pages/Signin';
import Signup from './pages/Signup';
import Signout from './pages/Signout';
import Home from './pages/Home';
import ActiveAccount from './pages/ActiveAccount';
import ForgetPassword from './pages/ForgetPassword';
import {BrowserRouter as Router,  Switch,  Route} from "react-router-dom";
import React, { useState, useEffect} from 'react'
function App() {
  
  return(
      <Router>
        <Switch>
          <Route path="/signin">
            <Signin />
          </Route>
          <Route path="/signup">
            <Signup />
          </Route>
          <Route path="/signout">
            <Signout />
          </Route>
          <Route path="/account/activate/:token">
            <ActiveAccount/>
          </Route>
          <Route path="/forget-password">
            <ForgetPassword/>
          </Route>
          <Route path="/">
            <Home/>
          </Route>
        </Switch>
      </Router>
)};
export default App;
