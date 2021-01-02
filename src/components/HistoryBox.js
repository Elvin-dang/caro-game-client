import React,{ useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Redirect } from 'react-router-dom';
import { Card, Button, Avatar, Box, CssBaseline, Grid, Typography, Container, TextField, GridList, CardContent, GridListTile } from '@material-ui/core';
import HistoryItem from './HistoryItem'
const useStyles = makeStyles((theme) => ({
    gridList: {
        width: '100%',
        height: 'auto',
        maxHeight: '655px'
    },
}));

export default function HistoryBox(props) { 
    const { history, userId } = props;
	const classes = useStyles();

	return (
        <GridList cellHeight={100} className={classes.gridList} cols={1} >
            {history.reverse().map((item, index) =>
                <HistoryItem key={index} index={index} item={item} userId={userId}/>
            )}
        </GridList>
    );
}