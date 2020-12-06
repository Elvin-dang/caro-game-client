import React from 'react';
import SigninComponent from '../components/Signin';
import { Redirect } from 'react-router-dom';

function Signin() {
	let login=null;
    if(JSON.parse(localStorage.getItem('login'))) login =JSON.parse(localStorage.getItem('login')).login;
    return login?(<Redirect to='/' />):(<SigninComponent />)
  }

export default Signin;