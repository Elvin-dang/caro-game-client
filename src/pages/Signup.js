import React from 'react';
import SignupComponent from '../components/Signup';
import { Redirect } from 'react-router-dom';
function Signup() {
	let login=null;
    if(JSON.parse(localStorage.getItem('login'))) login =JSON.parse(localStorage.getItem('login')).login;
    return login?(<Redirect to='/' />):(<SignupComponent />)
  }

export default Signup;