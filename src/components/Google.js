import React from 'react';
import { GoogleLogin } from 'react-google-login';
import oauthApi from '../api/oauthApi';
export default function Google(props) {
	const { setIsRedirect, setIsLoadingTrue, setIsLoadingFalse } = props;
	const responseGoogle = async(response) => {
		try{
			setIsLoadingTrue();
		  	if(response.profileObj!==undefined){
				const user = { tokenId: response.tokenId };
				const data = await oauthApi.googleLogin(user);
				if(data.token) {
					localStorage.setItem('login', JSON.stringify({
						login:true,
						token:data.token,
					}));
					const curUser = await oauthApi.getCurUser();   
        			localStorage.setItem('curUser', JSON.stringify(curUser));
					setIsLoadingFalse();
					setIsRedirect();
				} else {
					setIsLoadingFalse();
					alert("Please try again");
				}
			}
			else setIsLoadingFalse();
		}
		catch(e){
			setIsLoadingFalse();
			alert("Please try again!");
		}
	}
	return (
	  <GoogleLogin
	    clientId={process.env.REACT_APP_ggid}
	    buttonText="Login"
	    onSuccess={responseGoogle}
	    onFailure={responseGoogle}
	    cookiePolicy={'single_host_origin'}
	  />
	)
}