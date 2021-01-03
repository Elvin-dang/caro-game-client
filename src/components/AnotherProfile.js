import React,{ useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Redirect } from 'react-router-dom';
import { Paper, Button, Avatar, Box, CssBaseline, Grid, Typography, Container, TextField, IconButton, LinearProgress } from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import InfomationBox from './InfomationBox';
import HistoryBox from './HistoryBox';
import userApi from '../api/userApi';
import { useParams, Link, useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
}));

export default function AnotherProfile() { 
	const [resUser, setResUser] = useState({_id:"", avatar:null, email:"", elo:0, date:"", rank:"", game:{win:0, lose:0, total:0}, history:[]});
	const [isLoading, setIsLoading] = useState(true);
	const classes = useStyles();
	const history = useHistory();
	const { id } = useParams();
	
	useEffect(()=>{
		const fetchUser = async () => {
            try {
                const response = await userApi.getUser(id);
				setResUser(response);
				setIsLoading(false);
            } catch(err) {

            }
        }
        fetchUser();
	}, []);
	
	if(isLoading) return <LinearProgress/>;

	return (<div>{ resUser===null && (<Redirect to='/signin' />) }
		<CssBaseline />
    	<main>
	        <div>
			<Container maxWidth="md" >
				<Grid container alignItems='center' justify='center'>
					<Grid item xs={1} >
						{/* <Link to='/'> */}
							<IconButton onClick={() => history.goBack()} style={{height: '100%'}}>
								<ArrowBackIcon></ArrowBackIcon>
							</IconButton>
						{/* </Link> */}
					</Grid>
					<Grid item xs={11}>
						<Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
						Thông tin người chơi
						</Typography>
					</Grid>
				</Grid>
	        </Container>
	        </div>
	        <div>
	        	<Container >
	        		<Grid container spacing={1} >
						<Grid item xs={3} >
							<InfomationBox user={resUser}/>
	        			</Grid>
	        			<Grid item xs={9}>
							<Box display="flex" justifyContent="center" p={3} bgcolor="#a8adaa" style={{marginBottom: '10px'}}>
								<Typography component="h5" variant="h5" align="center" color="textPrimary" gutterBottom>
									Lịch sử đấu
								</Typography>
							</Box>
							<HistoryBox history={resUser.history} userId={resUser._id}/>
	        			</Grid>
	        		</Grid>
	        	</Container>
	        </div>
        </main>
	</div>);
}