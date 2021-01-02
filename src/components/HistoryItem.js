import React,{ useState } from 'react';
import Moment from 'react-moment';
import { makeStyles } from '@material-ui/core/styles';
import { Redirect, Link } from 'react-router-dom';
import { Card, Button, Grid, Typography, Container, CardContent, CardActions, CardHeader } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    backgroundWin: {
        backgroundColor: 'cyan'
    },
    bold: {
        fontWeight: 'bold'
    },
    cardItem_win: {
        width: '100%',
        marginBottom: '10px',
        backgroundColor: '#3af082'
    },
    cardItem_lose: {
        width: '100%',
        marginBottom: '10px',
        backgroundColor: '#ed2b5b'
    },
    cardItem_draw: {
        width: '100%',
        marginBottom: '10px',
        backgroundColor: '#d1cdce'
    },
}));

export default function HistoryItem(props) {
    const { item, index, userId } = props;
    const classes = useStyles();
    const playerPosition = userId === item.player1.id ? 1 : 2;
    let matchResult = 0; // 0 hòa - 1 win - 2 thua

    if(item.winner === 0) matchResult = 0;
    else if(playerPosition === item.winner) matchResult = 1;
    else matchResult = 2;

    switch(matchResult) {
        case 0: 
            return (
                <Card className={classes.cardItem_draw} variant="outlined">
                    <CardContent>
                        <Typography align="left" variant="caption" gutterBottom>
                            #{index + 1}
                        </Typography>
                        <Typography align="center" variant="h4" style={{color: '#8c898a'}} gutterBottom>
                            Hòa
                        </Typography>
                        <Grid container>
                            <Grid item xs={4}>
                                <Typography align="center" variant="h6">Người chơi</Typography>
                                <Typography align="center" className={playerPosition === 1 ? classes.bold : null}>Người chơi X: {item.player1.name}</Typography>
                                <Typography align="center" className={playerPosition === 2 ? classes.bold : null}>Người chời O: {item.player2.name}</Typography>
                            </Grid>
                            <Grid item xs={4}>
                                <Typography align="center" variant="h6">Thời gian</Typography>
                                <Typography align="center">
                                    <Moment format="hh:mm">
                                        {item.date}
                                    </Moment>
                                </Typography>
                                <Typography align="center">
                                    <Moment format="DD/MM/YYYY">
                                        {item.date}
                                    </Moment>
                                </Typography>
                            </Grid>
                            <Grid item xs={4}>
                                <Typography align="center" variant="h6">Số nước đi</Typography>
                                <Typography align="center">{item.move[0] ? item.move[0].history.length - 1 : "0"}</Typography>
                            </Grid>
                        </Grid>
                    </CardContent>
                    <CardActions>
                        <Link to= {{
                            pathname: `/history/${item._id}`,
                            game: item
                        }} style={{width: '100%', textDecoration:'none'}}>
                            <Button fullWidth style={{backgroundColor: '#8c898a'}} variant="contained">Chi tiết</Button>
                        </Link>
                    </CardActions>
                </Card>
            )
            case 1: 
                return (
                    <Card className={classes.cardItem_win} variant="outlined">
                    <CardContent>
                        <Typography align="left" variant="caption" gutterBottom>
                            #{index + 1}
                        </Typography>
                        <Typography align="center" variant="h4" style={{color: '#2bba64' }} gutterBottom>
                            Chiến thắng
                        </Typography>
                        <Grid container>
                            <Grid item xs={4}>
                                <Typography align="center" variant="h6">Người chơi</Typography>
                                <Typography align="center" className={playerPosition === 1 ? classes.bold : null}>Người chơi X: {item.player1.name}</Typography>
                                <Typography align="center" className={playerPosition === 2 ? classes.bold : null}>Người chời O: {item.player2.name}</Typography>
                            </Grid>
                            <Grid item xs={4}>
                                <Typography align="center" variant="h6">Thời gian</Typography>
                                <Typography align="center">
                                    <Moment format="hh:mm">
                                        {item.date}
                                    </Moment>
                                </Typography>
                                <Typography align="center">
                                    <Moment format="DD/MM/YYYY">
                                        {item.date}
                                    </Moment>
                                </Typography>
                            </Grid>
                            <Grid item xs={4}>
                                <Typography align="center" variant="h6">Số nước đi</Typography>
                                <Typography align="center">{item.move[0] ? item.move[0].history.length - 1 : "0"}</Typography>
                            </Grid>
                        </Grid>
                    </CardContent>
                    <CardActions>
                        <Link to= {{
                                pathname: `/history/${item._id}`,
                                game: item
                            }} style={{width: '100%', textDecoration:'none'}}>
                            <Button fullWidth style={{backgroundColor: '#2bba64'}} variant="contained">Chi tiết</Button>
                        </Link>
                    </CardActions>
                </Card>
                )
            case 2: 
                return (
                    <Card className={classes.cardItem_lose} variant="outlined">
                    <CardContent>
                        <Typography align="left" variant="caption" gutterBottom>
                            #{index + 1}
                        </Typography>
                        <Typography align="center" variant="h4" style={{color: '#911332'}} gutterBottom>
                            Thua cuộc
                        </Typography>
                        <Grid container>
                            <Grid item xs={4}>
                                <Typography align="center" variant="h6">Người chơi</Typography>
                                <Typography align="center" className={playerPosition === 1 ? classes.bold : null}>Người chơi X: {item.player1.name}</Typography>
                                <Typography align="center" className={playerPosition === 2 ? classes.bold : null}>Người chời O: {item.player2.name}</Typography>
                            </Grid>
                            <Grid item xs={4}>
                                <Typography align="center" variant="h6">Thời gian</Typography>
                                <Typography align="center">
                                    <Moment format="hh:mm">
                                        {item.date}
                                    </Moment>
                                </Typography>
                                <Typography align="center">
                                    <Moment format="DD/MM/YYYY">
                                        {item.date}
                                    </Moment>
                                </Typography>
                            </Grid>
                            <Grid item xs={4}>
                                <Typography align="center" variant="h6">Số nước đi</Typography>
                                <Typography align="center">{item.move[0] ? item.move[0].history.length - 1 : "0"}</Typography>
                            </Grid>
                        </Grid>
                    </CardContent>
                    <CardActions>
                        <Link to= {{
                                pathname: `/history/${item._id}`,
                                game: item
                            }} style={{width: '100%', textDecoration:'none'}}>
                            <Button fullWidth style={{backgroundColor: '#911332'}} variant="contained">Chi tiết</Button>
                        </Link>
                    </CardActions>
                </Card>
                )
        default: 
            break;
    }

    return (<></>);
}
