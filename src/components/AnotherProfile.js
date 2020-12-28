import React,{ useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Redirect } from 'react-router-dom';
import { Paper, Button, Avatar, Box, CssBaseline, Grid, Typography, Container, TextField } from '@material-ui/core';
import InfomationBox from './InfomationBox';
import HistoryBox from './HistoryBox';
const useStyles = makeStyles((theme) => ({
}));

export default function Profile(props) { 
    const { curUser } = props;
	const classes = useStyles();

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
	        				<InfomationBox curUser={curUser}/>
	        			</Grid>
	        			<Grid item xs={9}>
	        				<Box bgcolor="#e0e0e0" height={750}>
	        					<Box display="flex" justifyContent="left" p={3} >
									<Typography component="h5" variant="h5" align="left" color="textPrimary" gutterBottom>
										Match history
									</Typography>
                                </Box>
                                <InfomationBox matchHistory={matchHistory}/>
	        				</Box>
	        			</Grid>
	        		</Grid>
	        	</Container>
	        </div>
        </main>
	</div>);
}