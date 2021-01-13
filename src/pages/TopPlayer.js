import React,{ useEffect, useState } from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { CssBaseline, Grid, Avatar, Table, TableContainer, Typography, TableCell, TableBody, TableRow, TableHead, Paper, IconButton, Container } from '@material-ui/core';
import { Link } from 'react-router-dom';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import userApi from '../api/userApi';

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: '10px'
  },
}));

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

export default function TopPlayer() { 
    const [topPlayers, setTopPlayers] = useState([]);
    const classes = useStyles();
    useEffect(()=>{
        const fetchTopPlayers = async()=>{
            const response = await userApi.getTopPlayers();
            console.log(response);
            setTopPlayers(response);
        };
        fetchTopPlayers();
    }, [])
    return (
      <Grid container className={classes.root}>
        <Grid item xs={2}></Grid>
        <Grid item xs={8}>
          <Container>
            <Grid container alignItems='center' justify='center'>
              <Grid item xs={1} >
                <Link to='/'>
                  <IconButton style={{height: '100%'}}>
                    <ArrowBackIcon></ArrowBackIcon>
                  </IconButton>
                </Link>
              </Grid>
              <Grid item xs={11}>
                <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
                  Bảng xếp hạng
                </Typography>
              </Grid>
            </Grid>
          </Container>
          <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell>Top</StyledTableCell>
                  <StyledTableCell align="center">Tên</StyledTableCell>
                  <StyledTableCell align="center">Elo</StyledTableCell>
                  <StyledTableCell align="center">Rank</StyledTableCell>
                  <StyledTableCell align="center">Tổng số trận</StyledTableCell>
                  <StyledTableCell align="center">Tỷ lệ thắng</StyledTableCell>
                  <StyledTableCell align="center">Tỷ lệ (thắng/thua/hòa)</StyledTableCell>
                  <StyledTableCell align="center"></StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {topPlayers.map((player, index) => (
                  <StyledTableRow key={player._id}>
                    <StyledTableCell component="th" scope="row">
                      {index + 1}
                    </StyledTableCell>
                    <StyledTableCell align="center">{player.name}</StyledTableCell>
                    <StyledTableCell align="center">{player.elo}</StyledTableCell>
                    <StyledTableCell align="center">{player.rank}</StyledTableCell>
                    <StyledTableCell align="center">{player.game.total}</StyledTableCell>
                    <StyledTableCell align="center">{(player.game.total === 0 ? "0 %" : (Math.round(player.game.win * 100)/player.game.total).toFixed(2) + " %")}</StyledTableCell>
                    <StyledTableCell align="center">{player.game.win}/{player.game.lose}/{player.game.draw}</StyledTableCell>
                    <StyledTableCell align="right">
                      <IconButton href={'/user/' + player._id}>
                        <ArrowForwardIosIcon></ArrowForwardIosIcon>
                      </IconButton>
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
        <Grid item xs={2}></Grid>
      </Grid>
    );
}