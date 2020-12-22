import React from 'react';
import TopBar from '../components/TopBar';
import Dashboard from '../components/Dashboard'
import io from 'socket.io-client'
import {BrowserRouter as Router,  Switch,  Route, Redirect} from "react-router-dom";
import Room from '../components/Room';
import MessageList from '../components/MessageList';
import Profile from '../components/Profile';
function Home() {
	const socket = io.connect(process.env.REACT_APP_test_api_domain_withoutAPI,
		{
			transports: ['websocket'], 
			upgrade: false
		});

	let isLogin=false;
	if(JSON.parse(localStorage.getItem('login'))) isLogin = JSON.parse(localStorage.getItem('login')).login;
	
	return (
		<>
		{!isLogin ? <Redirect to="/signin"/>
		: (<>
			<TopBar isLogin={isLogin}/>
			<Router>
					<Switch>
						<Route path="/message">
							<MessageList socket={socket} isLogin={isLogin}/>
						</Route>
						<Route path="/room/:id">
							<Room socket={socket} isLogin={isLogin} />
						</Route>
						<Route path="/">
							<Dashboard socket={socket} isLogin={isLogin}/>
						</Route>
					</Switch>
			</Router>
			</>)
		}
		</>
	);
}

export default Home;