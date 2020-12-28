import React,{ useState, useEffect} from 'react';
import { useParams } from 'react-router-dom';
import {Card, CardContent, Grid, Link, Button,Paper, Box} from '@material-ui/core';
import swal from 'sweetalert';
import CaroGame from './CaroGame';
import MessageRoom from '../components/MessageRoom';
import { RoomOutlined } from '@material-ui/icons';
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
        },
        curGame: null,
        chat: [],
    });
    const [isEndGame, setIsEndGame] = useState(true);

    useEffect(()=>{
        socket.on('roomJoined',  response => setRoom(response));
        socket.on('roomUpdated', response => setRoom(response));
        socket.on('gameResult', response => showGameResult(response));
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
        if(room.player1.id === null || room.player2.id === null) swal(`Room ${room.roomId}`, 'Cần 2 người chơi để bắt đầu', "error");
        else if(curUser._id === room.player1.id || curUser._id === room.player2.id) {
            socket.emit("startGame", {
                ...room,
                nextTurn: 1,
                status: 1,
                curGame: {
                    date: Date.now,
                    player1: {
                        id: room.player1.id,
                        name: room.player1.name
                    },
                    player2: {
                        id: room.player2.id,
                        name: room.player2.name
                    },
                    winner: 0,
                    move: [],
                    chat: []
                }
            });
        }
        else swal(`Room ${room.roomId}`, 'Bạn phải là một trong hai người chơi chính để thực hiện chức năng này', "error");
    } 

    const handleDefeat = () => {
        if(curUser._id === room.player1.id || curUser._id === room.player2.id) {
            swal({
                title: "Bạn có chắc chắn đầu hàng trước đối thủ ?",
                icon: "warning",
                buttons: {
                    confirm: {
                        text: "Xác nhận",
                        value: "confirm"
                    },
                    cancel: "Không"
                },
            })
            .then((value) => {
                if(value === "confirm") {
                    socket.emit("gameResult", {
                        room: {
                            ...room,
                            status: 0
                        },
                        winner: curUser._id === room.player1.id ? 2 : 1,
                        resultType: "winLose" // Còn 1 type nữa là "draw"
                    });
                }
            });
        }
        else swal(`Room ${room.roomId}`, 'Bạn phải là một trong hai người chơi chính để thực hiện chức năng này', "error");
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

    const showGameResult = (response) => {
        const { winner, loser, resultType} = response;
        if(resultType !== "winLose") {
            swal("Kết quả", "Hòa", "info");
        } else {
            if(curUser._id === winner.id) {
                swal("Bạn là người chiến thắng", 
                    `Elo ban đầu: ${winner.first_elo}\n` +
                    `Tăng lên:    ${winner.final_elo} ↑`, 
                    "success"
                );
            } else if (curUser._id === loser.id) {
                    swal("Bạn đã thua", 
                    `Elo ban đầu: ${loser.first_elo}\n` +
                    `Giảm xuống:  ${loser.final_elo} ↓`, 
                    "error"
                );
            } else {
                if(winner.id === room.player1.id)
                    swal("Kết quả", 
                        `Người chơi X chiến thắng`, 
                        "success"
                    );
                else
                    swal("Kết quả", 
                        `Người chơi O chiến thắng`, 
                        "success"
                    );
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
                            <Grid container spacing={5}>
                                <Grid item xs={12} md={8}>
                                    <Grid container justify='center'>
                                        <CaroGame isStart={isMyTurn()} room={room} socket={socket}/>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <Card variant="outlined" style={{backgroundColor: room.nextTurn === 1 ? 'red' : 'white'}}>
                                        <CardContent>
                                            <h3>Người chơi (X): {room.player1.name ? room.player1.name : <Button onClick={() => joinPlayer(1)} style={{margin:'15px'}} variant="contained">Tham gia</Button>}</h3>
                                        </CardContent>
                                    </Card>
                                    <Card variant="outlined" style={{backgroundColor: room.nextTurn === 2 ? 'red' : 'white', marginTop: '10px', marginBottom: '15px'}}>
                                        <CardContent>
                                            <h3>Người chơi (O): {room.player2.name ? room.player2.name : <Button onClick={() => joinPlayer(2)} style={{margin:'15px'}} variant="contained">Tham gia</Button>}</h3>
                                        </CardContent>
                                    </Card>
                                    <Grid container direction="row" style={{marginBottom:'30px'}} justify="center" >
                                        <Button onClick={() => room.status === 0 ? handlePlay() : handleDefeat()} variant="contained" color="primary">{room.status === 0 ? "Bẳt đầu" : "Đầu hàng"}</Button>
                                        <Button onClick={() => leavePlayer()} style={{marginLeft:'30px'}} variant="contained" color="secondary" disabled={room.status === 0 ? false : true}>Làm khán giả</Button>
                                    </Grid>
                                    <MessageRoom socket={socket} room={room}/>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={1}/>
                </Grid>
            </Grid>
        </div>    
    )
  }
