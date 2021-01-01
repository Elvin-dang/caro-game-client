import React,{ useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Redirect } from 'react-router-dom';
import { Paper, Button, Avatar, Box, CssBaseline, Grid, Typography, Container, TextField } from '@material-ui/core';
import InfomationBox from './InfomationBox';
import HistoryBox from './HistoryBox';
import userApi from '../api/userApi';
import {useParams} from "react-router-dom";

const useStyles = makeStyles((theme) => ({
}));

export default function AnotherProfile() { 
	const [resUser, setResUser] = useState({_id:"", avatar:null, email:"", elo:0, date:"", rank:"", game:{win:0, lose:0, total:0}, history:[]});
	const classes = useStyles();
	const { id } = useParams();
	
	useEffect(()=>{
		const fetchUser = async () => {
            try {
                const response = await userApi.getUser(id);
				setResUser(response);
            } catch(err) {

            }
        }
        fetchUser();
	}, []);
	return (<div>{ resUser===null && (<Redirect to='/signin' />) }
		<CssBaseline />
    	<main>
        {/* Hero unit */}
	        <div>
	          <Container maxWidth="sm">
	            <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
	              Thông tin người chơi
	            </Typography>
	          </Container>
	        </div>
	        <div>
	        	<Container >
	        		<Grid container spacing={1} >
						<Grid item xs={3} >
							<InfomationBox user={resUser}/>
	        			</Grid>
	        			<Grid item xs={9}>
	        				<Box bgcolor="#e0e0e0" height={750}>
	        					<Box display="flex" justifyContent="left" p={3} >
									<Typography component="h5" variant="h5" align="left" color="textPrimary" gutterBottom>
										Match history
									</Typography>
                                </Box>
                                <HistoryBox history={resUser.history} userId={resUser._id}/>
	        				</Box>
	        			</Grid>
	        		</Grid>
	        	</Container>
	        </div>
        </main>
	</div>);
}