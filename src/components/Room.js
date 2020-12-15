import React,{ useState, useEffect} from 'react';
import { useParams } from 'react-router-dom';
import {Card, CardContent, Grid, Link, Button,Paper, Box} from '@material-ui/core';
import CaroGame from './CaroGame';

export default function Room(props) {    
    const curUser = JSON.parse(localStorage.getItem('curUser'));
    const socket = props.socket;
    const roomID = useParams().id;
    
    const [room, setRoom] = useState({
        roomId: null,
        hostName: null,
        status: null,
        nextTurn: 1,
        player1: {
            id: null,
            name: null
        },
        player2: {
            id: null,
            name: null
        }
    });

    useEffect(()=>{
        socket.on('roomJoined',  response => setRoom(response));
        socket.on('roomUpdated', response => setRoom(response));
    }, []);

    const joinPlayer = (position) =>{
        if(position === 1 && room.player2.id !== curUser._id)
        {
            socket.emit("updateRoom", {
                ...room,
                player1: {
                    id: curUser._id,
                    name: curUser.name
                }
            }); 
        }
        else if (position === 1 && room.player2.id === curUser._id)
        {
            socket.emit("updateRoom", {
                ...room,
                player1: {
                    id: curUser._id,
                    name: curUser.name
                },
                player2: {
                    id: null,
                    name: null
                }
            }); 
        }
        else if (position === 2 && room.player1.id !== curUser._id)
        {
            socket.emit("updateRoom", {
                ...room,
                player2: {
                    id: curUser._id,
                    name: curUser.name
                }
            }); 
        }
        else if (position === 2 && room.player1.id === curUser._id)
        {
            socket.emit("updateRoom", {
                ...room,
                player1: {
                    id: null,
                    name: null
                },
                player2: {
                    id: curUser._id,
                    name: curUser.name
                }
            }); 
        }
    }

    const leavePlayer = () => {
        if(room.player1.id === curUser._id)
        {
            socket.emit("updateRoom", {
                ...room,
                player1: {
                    id: null,
                    name: null
                }
            });
        }
        if(room.player2.id === curUser._id)
        {
            socket.emit("updateRoom", {
                ...room,
                player2: {
                    id: null,
                    name: null
                }
            });
        }
    };

    const handlePlay = () => {
        if(room.player1.id === null || room.player2.id === null) alert('Cần 2 người chơi để bắt đầu');
        else socket.emit("updateRoom", {
            ...room,
            status: 1
        });
    } 

    const handleRestart = () => {
        socket.emit("restartGame", {
            ...room,
            nextTurn: 1,
            status: 0
        });
    }

    const isMyTurn = () => {
        if(room.status === 0) return false;
        else {
            if(curUser._id === room.player1.id) {
                if(room.nextTurn === 1) return true;
                return false;
            } else if(curUser._id === room.player2.id) {
                if(room.nextTurn === 2) return true;
                return false;
            }
        }
    }

    return (
        <div>
            <div style={{textAlign:'center'}}>
                <h1>Room {roomID}</h1>
            </div>
            <Grid container>
                    <Grid container justify="center">
                        <Grid item xs={1}/>
                        <Grid item xs={10}>
                            <Grid container>
                                <Grid item xs={12} md={8}>
                                    <Grid container justify='center'>
                                        <CaroGame isStart={isMyTurn()} room={room} socket={socket}/>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <h3 style={{color: room.nextTurn === 1 ? 'red' : 'black'}}>Người chơi (X): {room.player1.name ? room.player1.name : <Button onClick={() => joinPlayer(1)} style={{margin:'15px'}} variant="contained">Tham gia</Button>}</h3>
                                    <h3 style={{color: room.nextTurn === 2 ? 'red' : 'black'}}>Người chơi (O): {room.player2.name ? room.player2.name : <Button onClick={() => joinPlayer(2)} style={{margin:'15px'}} variant="contained">Tham gia</Button>}</h3>
                                    <Button onClick={() => leavePlayer()} style={{marginBottom:'15px'}} variant="contained" color="secondary" disabled={room.status === 0 ? false : true}>Làm khán giả</Button>
                                    <Button onClick={() => room.status === 0 ? handlePlay() : handleRestart()} style={{marginBottom:'30px', display: 'block'}} variant="contained" color="primary">{room.status === 0 ? "Bẳt đầu" : "Chơi lại"}</Button>
                                    <Paper style={{width:'300px',height:'300px',borderColor:'red'}}>Khung chat</Paper>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={1}/>
                </Grid>
            </Grid>
        </div>    
    )
  }
