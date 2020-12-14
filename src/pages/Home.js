import React from 'react';
import TopBar from '../components/TopBar';

function Home() {
	let isLogin=false;
    if(JSON.parse(localStorage.getItem('login'))) isLogin =JSON.parse(localStorage.getItem('login')).login;
		if(isLogin === true){

		}  
	return (
	  <div>
		  <TopBar isLogin={isLogin}/>
		  {/* <Dashboard isLogin={isLogin}/> */}
	  </div>);
	}

export default Home;