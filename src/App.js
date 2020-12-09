import './App.css';
import Signin from './pages/Signin';
import Signup from './pages/Signup';
import Signout from './pages/Signout';
import Home from './pages/Home';
import {BrowserRouter as Router,  Switch,  Route} from "react-router-dom";
import React, { useState, useEffect} from 'react'

function App() {
  
  return(
      <Router>
      <div>  
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
          <Route exact path="/">
            <Home/>
          </Route>
        </Switch>
      </div>
      </Router>
)};
export default App;
