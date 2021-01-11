import React from 'react';
import { GoogleLogin } from 'react-google-login';
import oauthApi from '../api/oauthApi';
import swal from 'sweetalert';

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
					swal("Đã xảy ra lỗi khi đăng nhập bằng google", "", "error");
				}
			}
			else setIsLoadingFalse();
		}
		catch(err){
			setIsLoadingFalse();
			if(err.response.status === 400) swal(err.response.data.details[0].message, "", "warning");
			else if(err.response.status === 401) swal(err.response.data.message, "", "error");
			else if(err.response.status === 403) swal(err.response.data.message, "", "error");
			else swal("Server không phản hồi", "", "error");
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