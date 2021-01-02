import React,{ useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Redirect } from 'react-router-dom';
import { Paper, Button, Avatar, Box, CssBaseline, Grid, Typography, Container, TextField, IconButton } from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import userApi from '../api/userApi';
import AvatarEdit from 'react-avatar-edit';
import InfomationBox from './InfomationBox';
import { Link } from 'react-router-dom';
import swal from 'sweetalert';

const useStyles = makeStyles((theme) => ({
	paper: {
		display: 'flex',
		padding: theme.spacing(1),
	},
	infomation: {
		display: 'flex',
		padding: theme.spacing(2),
	},
	marginTop: {
		marginTop: '20px',
	  },
}));

export default function Profile() { 
	const classes = useStyles(); 
	const [user, setUser] = useState({ name: "", password: ""});
	const [curUser, setCurUser] = useState(JSON.parse(localStorage.getItem('curUser')));
	const [imageSource, setImageSource] = useState(null);
	const [avatar, setAvatar] = useState(null);

	useEffect(() => {
		const getUserInfo = async () => {
			const response = await userApi.getUser(curUser._id);
			setCurUser(response);
		}
		getUserInfo();
	}, [])

    const handleChangeName = async () =>{
    	if(user.name !== "")
    	{
    		const response = await userApi.updateUser({ email: curUser.email, name: user.name });
	    	setCurUser({ ...curUser, name: user.name});
			localStorage.setItem('curUser', JSON.stringify({ ...curUser, name: user.name}));
			if(response.msg === "Update successfully!") swal("Cập nhập tên thành công", "", "success");
			else swal("Cập nhâp tên thất bại", "", "error");
    	}
    }
    const handleChangePassword = async () =>{
		console.log(user.password);
		if(user.password !== "")
		{
			if(user.password.length < 6) swal("Mật khẩu cần tối thiểu 6 ký tự", "", "warning");
			const response = await userApi.updateUser({ email: curUser.email, password: user.password });
			if(response.msg === "Update successfully!") swal("Cập nhập mật khẩu thành công", "", "success");
			else swal("Cập nhâp mật khẩu thất bại", "", "error");
    	}
    }
    const handleUploadAvatar = async ()=>{
    	await setCurUser({ ...curUser, avatar: avatar});
    	await localStorage.setItem('curUser', JSON.stringify({ ...curUser, avatar: avatar}));
		const response = await userApi.updateUser({ email: curUser.email, avatar: avatar });
    	setAvatar(null);
    	setImageSource(null);
    }
    const onClose = () => {
		setAvatar(null);
	}

	const onCrop = (event) => {
		setAvatar(event);
	}

	const onBeforeFileLoad = (elem) => {
		if(elem.target.files[0].size > 71680){
			swal("Lỗi", "Kích thước ảnh lớn!", "error");
			elem.target.value = "";
		};
	}

	return (<div>{ !curUser && (<Redirect to='/signin' />) }
		<CssBaseline />
    	<main>
	        <div>
	          <Container maxWidth="md" >
				<Grid container alignItems='center' justify='center'>
					<Grid item xs={1} >
						<Link to='/'>
							<IconButton style={{height: '100%'}}>
								<ArrowBackIcon></ArrowBackIcon>
							</IconButton>
						</Link>
					</Grid>
					<Grid item xs={10}>
						<Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
						Thông tin cá nhân
						</Typography>
					</Grid>
					<Grid item xs={1} >
						<Link to={`/user/${curUser._id}`}>
							<IconButton style={{height: '100%'}}>
								<ArrowForwardIcon></ArrowForwardIcon>
							</IconButton>
						</Link>
					</Grid>
				</Grid>
	          </Container>
	        </div>
	        <div>
	        	<Container >
	        		<Grid container spacing={1} >
	        			<Grid item xs={3} >
							<InfomationBox user={curUser}/>
	        			</Grid>
	        			<Grid item xs={9}>
	        				<Box bgcolor="#e0e0e0" height={750}>
	        					<Box display="flex" justifyContent="left" p={3} >
									<Typography component="h5" variant="h5" align="left" color="textPrimary" gutterBottom>
										Chỉnh sửa thông tin
									</Typography>
								</Box>
	        					<Box display="flex" justifyContent="left" px={5} >
	        						<Grid  container spacing={3} >
										<Grid item xs={12}>
											<Grid  container spacing={3} >
												<Grid item xs={8}>
													<TextField variant="outlined" margin="normal" required fullWidth id="name" label="Tên mới" name="name" 
														onChange={e => setUser({ ...user, name: e.target.value})} />
												</Grid>
												<Grid item xs={4}>
													<Button className={classes.marginTop} onClick={handleChangeName} fullWidth variant="contained" color="primary" >Thay đổi tên</Button>
												</Grid>
											</Grid>
										</Grid>
										{curUser.accessType === 'email' ?
										<Grid item xs={12}>
											<Grid  container spacing={3} >
												<Grid item xs={8}>
													<TextField variant="outlined" margin="normal" required fullWidth name="password" label="Mật khẩu mới" type="password" id="password"
														onChange={e => setUser({ ...user, password: e.target.value})} />
												</Grid>
												<Grid item xs={4}>
													<Button className={classes.marginTop} onClick={handleChangePassword} fullWidth variant="contained" color="primary" >Thay đổi mật khẩu</Button>
												</Grid>
											</Grid>
										</Grid>
										: <></>}
										<Grid item xs={6}>
											<AvatarEdit
											width={390}
											height={295}
											onCrop={onCrop}
											onClose={onClose}
											onBeforeFileLoad={onBeforeFileLoad}
											src={imageSource}
											/>
										</Grid>
										<Grid item xs={6}>	
											{avatar ? 
											<img src={avatar} alt="Xem trước" />
											: 
											<Typography>Thêm ảnh để xem trước</Typography>
											}
										</Grid>
										<form method="form" onSubmit={handleUploadAvatar}>
											<Box display="flex" justifyContent="left" m={1} p={1} >
												<Button type="submit" fullWidth variant="contained" color="primary" >Đổi ảnh đại diện</Button>
											</Box>
										</form>
									</Grid>
								</Box>
	        				</Box>
	        			</Grid>
	        		</Grid>
	        	</Container>
	        </div>
        </main>
	</div>);
}