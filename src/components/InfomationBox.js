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
    const { user } = props;
    const classes = useStyles();
    
    return(<Box bgcolor="info.main" height={750}>
        <Paper class={classes.paper}>
            <Box display="flex" justifyContent="center" p={3} >
                <Avatar alt="avatar" src={user.avatar} />
            </Box>
            <Box display="flex" justifyContent="left" m={1} p={1} >
                <h2>{user.name}</h2>
            </Box>
        </Paper>
        <Paper class={classes.infomation}>
            <Grid  container spacing={1} >
                <Grid item xs={12}>
                    <h4>Email: {user.email}</h4>
                </Grid>
                <Grid item xs={12}>
                    <h4>Created on: {user.date}</h4>
                </Grid>
                <Grid item xs={12}>
                    <h4>Rank: {user.rank}</h4>
                </Grid>
                <Grid item xs={12}>
                    <h4>Elo: {user.elo}</h4>
                </Grid>
                <Grid item xs={12}>
                    <h4>Win rate: {(user.game.total==0 ? "0%" : user.game.win*100/user.game.total+"%")}</h4>
                </Grid>
                <Grid item xs={12}>
                    <h4>Total games: {user.game.total}</h4>	
                </Grid>
            </Grid>
        </Paper>
    </Box>)
}
