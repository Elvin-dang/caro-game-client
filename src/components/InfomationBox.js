import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Paper, Avatar, Box, Grid} from '@material-ui/core';

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
    const { curUser } = props;
    const classes = useStyles();
    
    return(<Box bgcolor="info.main" height={750}>
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
    </Box>)
}
