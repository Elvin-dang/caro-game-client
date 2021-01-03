import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Grid, Typography, IconButton, Container } from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import CaroBoard from './CaroBoard';
import Message from './MessageItem';
import { useParams, useLocation, useHistory } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
    btnBold: {
        fontWeight: 'bold',
    },
    game: {
        display: 'flex',
        flexDirection: 'row',
        minWidth: '705px',
    },
    gameInfo: {
        marginLeft: '20px'
    },
    chatBox: {
        marginLeft: '20px'
    },
    root: {
        width: '100%',
        height: 565,
        backgroundColor:'#cfe8fc',
        padding: '10px',
    },
    messList: {
        flexGrow: 1,
        width: '100%',
        height: '100%',
        overflow: 'auto',
    },
}));

const size = 20;
const winCondition = 5;

const CaroGameHistory = () => {
    const historyPage = useHistory();
    const { game } = useLocation();
    const { move } = game;
    let isStart = false;

    let tmpArr = Array(size);
    for (let i = 0; i < size; i++) {
      tmpArr[i] = Array(size).fill(null);
    }

    const [gameConfig, setGameConfig] = useState({
        width: size,
        height: size,
        history: [{
            squares: tmpArr,
            location: null
        }],
        stepNumber: 0,
        xIsNext: true,
        isDescending: true
    });
    const classes = useStyles();

    useEffect(() => {
        if(move[0]) setGameConfig(move[0]);
    }, []);

    const history = gameConfig.history;
    const current = history[gameConfig.stepNumber];
    const winner = calculateWinner(current.squares);
    let moves = history.map((step, move) => {
        const desc = move ?
        `\"${move%2 === 1 ? game.player1.name : game.player2.name}\"` 
        + ' đánh vào vị trí'
        + ' (' + step.location.x + ',' + step.location.y + ')' :
        'Bắt đầu trận đấu';
        return (gameConfig.stepNumber === move) ? (
            <li key={move}>
                <Button className={classes.btnBold} onClick={() => jumpTo(move)}>{desc}</Button>
            </li>
        ) : (
            <li key={move}>
                <Button onClick={() => jumpTo(move)}>{desc}</Button>
            </li>
        );
    })
    if(!gameConfig.isDescending) {
        moves = moves.reverse();
    }

    let arrow = gameConfig.isDescending ? '↓' : '↑';
    let status;
    if (winner) {
        status = 'Người thắng cuộc: ' + `${winner.val === "X" ? game.player1.name + " (X)" : game.player2.name + " (O)"}`;
    } else {
        status = 'Lượt tiếp theo: ' + (gameConfig.xIsNext ? game.player1.name + " (X)" : game.player2.name + " (O)");
    }

    const jumpTo = (step) => {
        setGameConfig({
            ...gameConfig,
            stepNumber: step,
            xIsNext: (step % 2) === 0
        });
    }

    const handleClick = (i, j) => {
        if(!isStart) return;
        const newHistory = gameConfig.history.slice(0, gameConfig.stepNumber + 1);
        const current = history[gameConfig.stepNumber];
        const squares = current.squares.slice();

        current.squares.map((row, index) => {
            squares[index] = current.squares[index].slice();
            return true;
        });

        if(squares[i][j] || calculateWinner(squares)) return;
       
        squares[i][j] = gameConfig.xIsNext ? 'X' : 'O';
        
        setGameConfig({
            ...gameConfig,
            history: newHistory.concat([{
                squares: squares,
                location: {x: i, y: j}
            }]),
            stepNumber: newHistory.length,
            xIsNext: !gameConfig.xIsNext
        });
    }

    const sort = () => {
        setGameConfig({
            ...gameConfig,
            isDescending: !gameConfig.isDescending
        })
    }

    return (
        <div>
            <Container maxWidth="md" >
                <Grid container alignItems='center' justify='center'>
                    <Grid item xs={1} >
                            <IconButton onClick={() => historyPage.goBack()} style={{height: '100%'}}>
                                <ArrowBackIcon></ArrowBackIcon>
                            </IconButton>
                    </Grid>
                    <Grid item xs={11}>
                        <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
                        Xem lại trận đấu
                        </Typography>
                    </Grid>
                </Grid>
            </Container>
            <Grid container justify="center">
                <Grid item xs={1}/>
                <Grid item xs={10}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} lg={5}>
                            <div className={classes.game}>
                                <CaroBoard
                                    squares={current.squares}
                                    onClick={(i, j) => handleClick(i, j)}
                                    winner={winner}
                                    isStart={isStart}
                                />
                            </div>
                        </Grid>
                        <Grid item xs={12} lg={3}>
                            <div className={classes.gameInfo} style={{marginTop: '20px'}}>
                                <div style={{display: 'flex', justifyContent: 'center', marginBottom: '20px'}}>
                                    <Button onClick={sort} variant="outlined">Thứ tự bước {arrow}</Button>
                                </div>
                                <div style={{textAlign: "center", color: '#fcba03'}}>{status}</div>
                                <ol style={{height: '550px', overflow: 'hidden', overflowY: 'scroll'}}>{moves}</ol>
                            </div>
                        </Grid>
                        <Grid item xs={12} md={12} lg={4}>
                            <Typography align="center" variant="h4" gutterBottom style={{marginTop: '20px'}}>Tin nhắn trong trận</Typography>
                            <div className={classes.root} id="messages">
                                <div className={classes.messList}>
                                    {game.chat.map((item, index) =>
                                        <Message key={index} message={item}/>
                                    )}
                                </div>
                            </div>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={1}/>
            </Grid>
        </div>
    )
}

const calculateWinner = (squares) => {
    let win;
    for (let i = 0; i < squares.length; i++) {
      for (let j = 0; j < squares[i].length; j++) {
        if (!squares[i][j]) continue;
        if (j <= squares[i].length - winCondition) {
          win = true;
          for (let k = 0; k < winCondition - 1; k++) {
            if (squares[i][j + k] !== squares[i][j + k + 1]) {
              win = false
            }
          }
          if (win) return {val: squares[i][j], x: j, y: i, direction: 'ToRight'};
        }
        if (i <= squares.length - winCondition) {
          win = true;
          for (let k = 0; k < winCondition - 1; k++) {
            if (squares[i + k][j] !== squares[i + k + 1][j]) {
              win = false
            }
          }
          if (win) return {val: squares[i][j], x: j, y: i, direction: 'ToDown'};
        }
        if (j <= squares[i].length - winCondition && i <= squares.length - winCondition) {
          win = true;
          for (let k = 0; k < winCondition - 1; k++) {
            if (squares[i + k][j + k] !== squares[i + k + 1][j + k + 1]) {
              win = false
            }
          }
          if (win) return {val: squares[i][j], x: j, y: i, direction: 'ToRightDown'};
        }
        if (i <= squares.length - winCondition && j >= winCondition - 1) {
          win = true;
          for (let k = 0; k < winCondition - 1; k++) {
            if (squares[i + k][j - k] !== squares[i + k + 1][j - k - 1]) {
              win = false
            }
          }
          if (win) return {val: squares[i][j], x: j, y: i, direction: 'ToLeftDown'};
        }
      }
    }
    return null;
}

export default CaroGameHistory;
