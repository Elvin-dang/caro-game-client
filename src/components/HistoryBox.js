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

	return (
        <Box display="flex" justifyContent="left" px={5} >
            
		</Box>
    );
}