import React,{ useState, useEffect} from 'react';
import { useParams } from 'react-router-dom';
import {Card,CardContent, Grid, Link, Button,Paper} from '@material-ui/core';


export default function Room(props) {    
    const curUser = JSON.parse(localStorage.getItem('curUser'));
    const socket = props.socket;
    const roomID = useParams().id;
    
    const [room, setRoom] = useState({
        roomId: null,
        hostName: null,
        status: null,
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
        if(position === 1 && room.player1.id !== curUser._id)
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
        else if (position === 2 && room.player2.id === curUser._id)
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

    return (
        <div>
            <div style={{textAlign:'center'}}>
                <h1>Room {roomID}</h1>
            </div>
            <Grid container >
                    <Grid container justify="center" >
                        <Paper style={{width:'600px',height:'600px',borderColor:'red'}}>
                            bàn cờ
                        </Paper>
                        <Card style={{width:'500x',padding:'15px'}}>
                            <h3>Người chơi 1: {room.player1.name ? room.player1.name : <Button onClick={() => joinPlayer(1)} style={{margin:'15px'}} variant="contained">Tham gia</Button>}</h3>
                            <h3>Người chơi 2: {room.player2.name ? room.player2.name : <Button onClick={() => joinPlayer(2)} style={{margin:'15px'}} variant="contained">Tham gia</Button>}</h3>
                            <Button onClick={() => { leavePlayer() }} style={{margin:'15px'}} variant="contained" color="secondary">Làm khán giả</Button>
                            <Paper style={{width:'300px',height:'300px',borderColor:'red'}}>Khung chat</Paper>
                        </Card>
                </Grid>
            </Grid>
        </div>    
    )
  }
