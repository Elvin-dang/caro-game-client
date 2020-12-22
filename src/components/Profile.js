import React,{ useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Redirect } from 'react-router-dom';
import { Paper, Button, Avatar, Box, CssBaseline, Grid, Typography, Container, TextField } from '@material-ui/core';
import userApi from '../api/userApi';
import AvatarEdit from 'react-avatar-edit';

const useStyles = makeStyles((theme) => ({
	paper: {
		display: 'flex',
		padding: theme.spacing(1),
	},
	infomation: {
		display: 'flex',
		padding: theme.spacing(2),
	}
}));
export default function Profile(props) { 
	const classes = useStyles(); 
	const [user, setUser] = useState({ name: "", password: ""});
	const [curUser, setCurUser] = useState(JSON.parse(localStorage.getItem('curUser')));
	const [imageSource, setImageSource] = useState(null);
	const [avatar, setAvatar] = useState(null);
    const handleChangeName = async () =>{
    	if(user.name!=="")
    	{
    		const response = await userApi.updateUser({ email: curUser.email, name: user.name });
	    	await setCurUser({ ...curUser, name: user.name});
	    	localStorage.setItem('curUser', JSON.stringify(curUser));
    	}
    }
    const handleChangePassword = async () =>{
    	if(user.password!==""){
    		const response = await userApi.changePassword({ email: curUser.email, password: user.password });
    	}
    }
    const handleUploadAvatar = async ()=>{
    	await setCurUser({ ...curUser, avatar: avatar});
    	await localStorage.setItem('curUser', JSON.stringify(curUser));
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
	        				<Box bgcolor="info.main" height={750}>
	        					<Paper class={classes.paper}>
			        				<Box display="flex" justifyContent="center" p={3} >
										<Avatar alt="avatar" src={curUser.avatar} />
			        				</Box>
			        				<Box display="flex" justifyContent="left" m={1} p={1} >
										<h2>{curUser.name}</h2>
									</Box>
								</Paper>
								<Paper class={classes.infomation}>
			        				<Grid  container spacing={1} >
			        					<Grid item xs={12}>
			        						<h4>Email: {curUser.email}</h4>
			        					</Grid>
			        					<Grid item xs={12}>
			        						<h4>Email: {curUser.email}</h4>
			        					</Grid>
			        					<Grid item xs={12}>
			        						<h4>Email: {curUser.email}</h4>
			        					</Grid>
			        					<Grid item xs={12}>
			        						<h4>Email: {curUser.email}</h4>
			        					</Grid>
			        					<Grid item xs={12}>
			        						<h4>Email: {curUser.email}</h4>
			        					</Grid>
			        					<Grid item xs={12}>
			        						<h4>Email: {curUser.email}</h4>	
			        					</Grid>
			        				</Grid>
								</Paper>
							</Box>
	        			</Grid>
	        			<Grid item xs={9}>
	        				<Box bgcolor="#e0e0e0" height={750}>
	        					<Box display="flex" justifyContent="left" p={3} >
									<Typography component="h5" variant="h5" align="left" color="textPrimary" gutterBottom>
										Edit your profile
									</Typography>
								</Box>
	        					<Box display="flex" justifyContent="left" px={5} >
	        						<Grid  container spacing={3} >
		        						<Grid item xs={12}>
											<TextField variant="outlined" margin="normal" required fullWidth id="name" label="New name" name="name" 
												onChange={e => setUser({ ...user, name: e.target.value})} />
											<Button onClick={handleChangeName} fullWidth variant="contained" color="primary" >Change name</Button>
										</Grid>
										<Grid item xs={12}>
											<TextField variant="outlined" margin="normal" required fullWidth name="password" label="New password" type="password" id="password"
												onChange={e => setUser({ ...user, password: e.target.value})} />
											<Button onCLick={handleChangePassword} fullWidth variant="contained" color="primary" >Change Password</Button>
										</Grid>
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
											<img src={avatar} alt="Preview" />
										</Grid>
										<form method="form" onSubmit={handleUploadAvatar}>
											<Box display="flex" justifyContent="left" m={1} p={1} >
												<Button type="submit" fullWidth variant="contained" color="primary" >Apply</Button>
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