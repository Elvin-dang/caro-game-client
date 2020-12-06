import React from 'react';
import { Redirect } from 'react-router-dom';

	function Signout() {
		localStorage.removeItem('login');
		return (<Redirect to='/signin' />);
	}

export default Signout;