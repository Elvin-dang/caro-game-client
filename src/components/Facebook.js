import React from 'react';
import FacebookLogin from 'react-facebook-login';
import oauthApi from '../api/oauthApi';
import swal from 'sweetalert';

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
				const curUser = await oauthApi.getCurUser();   
		        localStorage.setItem('curUser', JSON.stringify(curUser));
				setIsLoadingFalse();
				setIsRedirect();
			} else {
				setIsLoadingFalse();
				swal("Đã xảy ra lỗi khi đăng nhập bằng facebook", "", "error");
			}
		}catch(err){
			setIsLoadingFalse();
			if(err.response.status === 400) swal(err.response.data.details[0].message, "", "warning");
			else if(err.response.status === 401) swal(err.response.data.message, "", "error");
			else if(err.response.status === 403) swal(err.response.data.message, "", "error");
			else swal("Server không phản hồi", "", "error");
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