import React from 'react';
import { GoogleLogin } from 'react-google-login';
export default function Google(props) {
	const { setIsRedirect, setIsLoadingTrue, setIsLoadingFalse } = props;
	const responseGoogle = async(response) => {
		try{
			setIsLoadingTrue();
		  	if(response.profileObj!==undefined){
				const user = { tokenId: response.tokenId };
				await fetch(process.env.REACT_APP_api_domain+"/oauth/google", {
					method: "POST",
					headers: {'Content-Type':'application/json'},
					body: JSON.stringify(user),
				}).then(resp => resp.json()).then(data=>{
				if(data.token){
					setIsLoadingFalse();
					localStorage.setItem('login', JSON.stringify({
						login:true,
						token:data.token,
					}));
					setIsRedirect();
				}
				else {
					setIsLoadingFalse();
					alert("Please try again");
				}
				})
			}
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