import React,{ useState } from 'react';
import { Redirect } from 'react-router-dom';
import { Button, Avatar, Box, CssBaseline, Grid, Typography, Container, TextField } from '@material-ui/core';
import userApi from '../api/userApi';
import AvatarEdit from 'react-avatar-edit';


export default function Profile(props) {  
	const [user, setUser] = useState({ name: "", password: ""});
	const [imageSource, setImageSource] = useState(null);
	const [avatar, setAvatar] = useState(null);
    const curUser = JSON.parse(localStorage.getItem('curUser'));
    const handleChangeName = async () =>{
    	const response = await userApi.updateUser({ email: curUser.email, name: user.name });
    	curUser.name = user.name;
    	localStorage.setItem('curUser', JSON.stringify(curUser));
    }
    const handleChangePassword = async () =>{
    	const response = await userApi.changePassword({ email: curUser.email, password: user.password });
    }
    const handleUploadAvatar = async ()=>{
		const response = await userApi.updateUser({ email: curUser.email, avatar: avatar });
		curUser.avatar = user.avatar;
    	localStorage.setItem('curUser', JSON.stringify(curUser));
    }
    const onClose = () => {
		setAvatar(null);
	}

	const onCrop = (event) => {
		setAvatar(event);
	}

	const onBeforeFileLoad = (elem) => {
		if(elem.target.files[0].size > 71680){
			alert("File is too big!");
			elem.target.value = "";
		};
	}

	return (<div>{ !curUser && (<Redirect to='/signin' />) }
		<CssBaseline />
    	<main>
        {/* Hero unit */}
	        <div>
	          <Container maxWidth="sm">
	            <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
	              Profile
	            </Typography>
	          </Container>
	        </div>
	        <div>
	        	<Container >
	        		<Grid container spacing={1} >
	        			<Grid item xs={3} >
	        			<Box bgcolor="info.main" height={500}>
		        				<Box display="flex" justifyContent="center" p={3} >
										<Avatar alt={curUser.name} src={curUser.avatar} />
		        				</Box>
		        				<Box display="flex" justifyContent="left" m={1} p={1} >
									<h3>{curUser.name}</h3>
								</Box>
							</Box>
	        			</Grid>
	        			<Grid item xs={9}>
	        				<Box bgcolor="#e0e0e0" height={500}>
	        					<Box display="flex" justifyContent="left" p={5} >
									<Typography component="h5" variant="h5" align="left" color="textPrimary" gutterBottom>
										Edit your profile
									</Typography>
								</Box>
	        					<Box display="flex" justifyContent="left" px={5} >
	        						<Grid  container spacing={4} >
		        						<Grid item xs={12}>
			        					<form method="form" id="form-data1" onSubmit={handleChangeName} autoComplete="off">
											<TextField variant="outlined" margin="normal" required fullWidth id="name" label="New name" name="name" 
												onChange={e => setUser({ ...user, name: e.target.value})} value={user.name} />
											<Button type="submit" fullWidth variant="contained" color="primary" >Change name</Button>
										</form>
										</Grid>
											<Grid item xs={12} mt={3}>
											<form method="form" id="form-data2" onSubmit={handleChangePassword} autoComplete="off">
												<TextField variant="outlined" margin="normal" required fullWidth name="password" label="New password" type="password" id="password"
													onChange={e => setUser({ ...user, password: e.target.value})} value={user.password} autoComplete="current-password" />
												<Button type="submit" fullWidth variant="contained" color="primary" >Change Password</Button>
											</form>
											<div>
												<AvatarEdit
												width={390}
												height={295}
												onCrop={onCrop}
												onClose={onClose}
												onBeforeFileLoad={onBeforeFileLoad}
												src={imageSource}
												/>
												<img src={avatar} alt="Preview" />
											</div>
											<form method="form" onSubmit={handleUploadAvatar}>
												<Box display="flex" justifyContent="left" m={1} p={1} >
													<Button type="submit" fullWidth variant="contained" color="primary" >Upload</Button>
												</Box>
											</form>
										</Grid>
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