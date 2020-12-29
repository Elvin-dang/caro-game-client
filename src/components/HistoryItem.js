import React,{ useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Redirect } from 'react-router-dom';
import { Paper, Button, Avatar, Box, CssBaseline, Grid, Typography, Container, TextField } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    backgroundWin: {
        backgroundColor: 'cyan'
    },
    center:{
        marginLeft: '10px',
    }
}));

export default function HistoryItem(props) { 
    const { item, userId } = props;
    const classes = useStyles();
    const isWin = ((item.winner==1 && item.player1._id==userId)||(item.winner==2 && item.player2._id==userId)) ? true : false;
    return (<Grid item xs={12}>
            <Paper className={isWin && classes.backgroundWin}>
                <Grid  container >
                    <Grid  item xs={2}>
                        <h2 className={classes.center}>{isWin ? "Win" : "Lose"}</h2>
                    </Grid>
                    <Grid item xs={7}>
                        <h4>X {item.player1.name}</h4>
                        <h4>O {item.player2.name}</h4>
                    </Grid>
                    <Grid item xs={3}>
                        <h4>10 moves</h4>
                        <Typography align="right" variant="subtitle1" color="textSecondary">
                        12/29/2020
                    </Typography>
                    </Grid>
                </Grid>
            </Paper>
        </Grid>
    )
}
