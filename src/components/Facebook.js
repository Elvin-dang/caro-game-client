import React from 'react';
import FacebookLogin from 'react-facebook-login'
export default function Facebook(props) {
	const { setIsRedirect } = props;
	const responseFacebook = async (response) => {
		try{
			const user = { userID: response.userID, accessToken: response.accessToken };
			await fetch(process.env.REACT_APP_api_domain+"/oauth/facebook", {
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
		}catch(e){
			alert(e);
		}
	};
	const componentClicked = () => {

	};
    return (<div><FacebookLogin
          appId={process.env.REACT_APP_fbid}
          autoLoad={true}
          fields="name,email"
          onClick={componentClicked}
          callback={responseFacebook}
        /></div>);
}