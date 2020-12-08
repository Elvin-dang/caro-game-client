import React from 'react';
import FacebookLogin from 'react-facebook-login'
export default function Facebook(props) {
	const { setIsRedirect, setIsLoadingTrue, setIsLoadingFalse } = props;
	const responseFacebook = async (response) => {
		try{
			setIsLoadingTrue();
			const user = { userID: response.userID, accessToken: response.accessToken };
			await fetch(process.env.REACT_APP_api_domain+"/oauth/facebook", {
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