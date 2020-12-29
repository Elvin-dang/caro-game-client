import React,{ useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Redirect } from 'react-router-dom';
import { Paper, Button, Avatar, Box, CssBaseline, Grid, Typography, Container, TextField } from '@material-ui/core';
import HistoryItem from './HistoryItem'
const useStyles = makeStyles((theme) => ({
}));

export default function HistoryBox(props) { 
    const { history, userId } = props;
	const classes = useStyles();

	return (
        <Paper >
            <Grid container spacing={1} >
                {history.map((item, index) =>
                    <HistoryItem key={index} item={item} userId={userId}/>
                )}
            </Grid>
		</Paper>
    );
}