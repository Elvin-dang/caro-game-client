import React from 'react';
import FacebookLogin from 'react-facebook-login';
import oauthApi from '../api/oauthApi';
export default function Facebook(props) {
	const { setIsRedirect, setIsLoadingTrue, setIsLoadingFalse } = props;
	const responseFacebook = async (response) => {
		try{
			setIsLoadingTrue();
			const user = { userID: response.userID, accessToken: response.accessToken };
			const data = await oauthApi.facebookLogin(user);
			if(data.token) {
				localStorage.setItem('login', JSON.stringify({
					login:true,
					token:data.token,
				}));
				setIsLoadingFalse();
				setIsRedirect();
			} else {
				setIsLoadingFalse();
				alert("Please try again");
			}
		}catch(e){
			setIsLoadingFalse();
			alert("Please try again!");
		}
	};
	const componentClicked = () => {

	};
    return (<div><FacebookLogin
          appId={process.env.REACT_APP_fbid}
          fields="name,email"
          onClick={componentClicked}
          callback={responseFacebook}
        /></div>);
}