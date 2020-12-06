import React from 'react';
import { GoogleLogin } from 'react-google-login';
export default function Google(props) {
	const { setIsRedirect } = props;
	const responseGoogle = async(response) => {
		try{
		  	if(response.profileObj!==undefined){
				const user = { tokenId: response.tokenId };
				await fetch(process.env.REACT_APP_api_domain+"/oauth/google", {
					method: "POST",
					headers: {'Content-Type':'application/json'},
					body: JSON.stringify(user),
				}).then(resp => resp.json()).then(data=>{
				if(data.token){
					localStorage.setItem('login', JSON.stringify({
						login:true,
						token:data.token,
					}));
					setIsRedirect();
				}
				else {
					  alert("Please try again");
					}
				})
			}
		}
		catch(e){
			alert(e);
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