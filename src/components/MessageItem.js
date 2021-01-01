import React from 'react';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
const useStyles = makeStyles((theme) => ({
    paper: {
        margin: `${theme.spacing(1)}px auto`,
        padding: theme.spacing(2),
    },
}));
export default function MessageItem(props) {
    const { message } = props;
    const classes = useStyles();
    return (
        <Paper className={classes.paper}>
            <Grid container wrap="nowrap" spacing={2}>
                <Grid item>
                    <Avatar alt="avatar" src={message.avatar}></Avatar>
                </Grid>
                <Grid item>
                    <b>{message.name}</b>
                    <Typography >{message.message}</Typography>
                </Grid>
            </Grid>
        </Paper>
    )
}