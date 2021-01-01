import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import CaroBoard from './CaroBoard';
import { io } from 'socket.io-client';
import { SportsHockeyRounded } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
    btnBold: {
        fontWeight: 'bold',
    },
    game: {
        display: 'flex',
        flexDirection: 'row'
    },
    gameInfo: {
        marginLeft: '20px'
    }
}));

const size = 20;
const winCondition = 5;

const CaroGame = ({ socket, isStart, room }) => {
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

    useEffect(()=>{
        socket.on('updateGameConfig', response => setGameConfig(response));
        socket.on('opponentMove',  response => handleClick(response.i, response.j));
    }, [socket]);

    const history = gameConfig.history;
    const current = history[gameConfig.stepNumber];
    const winner = calculateWinner(current.squares);
    let moves = history.map((step, move) => {
        const desc = move ?
        'Go to move #' + move + ' (' + step.location.x + ',' + step.location.y + ')' :
        'Go to game start';
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
    if(gameConfig.isDescending) {
        moves = moves.reverse();
    }

    let arrow = gameConfig.isDescending ? '↓' : '↑';
    let status;
    if (winner) {
        status = 'Winner: ' + winner.val;
    } else {
        status = 'Next player: ' + (gameConfig.xIsNext ? 'X' : 'O');
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
        
        socket.emit('nextMove', {
            i: i,
            j: j,
            room: room,
            gameConfig: {
                ...gameConfig,
                history: newHistory.concat([{
                    squares: squares,
                    location: {x: i, y: j}
                }]),
                stepNumber: newHistory.length,
                xIsNext: !gameConfig.xIsNext
            }
        });
        
        if(calculateWinner(squares)) 
        {
            socket.emit("gameResult", {
                room: {
                    ...room,
                    status: 0
                },
                winner: gameConfig.xIsNext ? 1 : 2,
                resultType: "winLose" // Còn 1 type nữa là "draw"
            });
        }
    }

    const sort = () => {
        setGameConfig({
            ...gameConfig,
            isDescending: !gameConfig.isDescending
        })
    }

    return (
        <div>
            <div className={classes.game}>
                <div>
                    <CaroBoard
                        squares={current.squares}
                        onClick={(i, j) => handleClick(i, j)}
                        winner={winner}
                        isStart={isStart}
                    />
                </div>
                {/* <div className={classes.gameInfo}>
                    <div>
                        <Button onClick={sort}>Thứ tự bước {arrow}</Button>
                    </div>
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div> */}
            </div>
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

export default CaroGame;
