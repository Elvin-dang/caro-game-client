import React,{ useState, useEffect} from 'react';
import { Redirect, useParams } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import {Card, CardContent, Grid, Link, Button,Paper, Box, CardHeader, CardActions} from '@material-ui/core';
import swal from 'sweetalert';
import CaroGame from './CaroGame';
import MessageRoom from '../components/MessageRoom';
import CountDown from './CountDown';
import { RoomOutlined } from '@material-ui/icons';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';

import loading from "./loading.svg"

//setting dialog styles
const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const DialogTitle = withStyles(styles)((props) => {
    const { children, classes, onClose, ...other } = props;
    return (
      <MuiDialogTitle disableTypography className={classes.root} {...other}>
        <Typography variant="h6">{children}</Typography>
        {onClose ? (
          <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
            <CloseIcon />
          </IconButton>
        ) : null}
      </MuiDialogTitle>
    );
  });
  
  const DialogContent = withStyles((theme) => ({
    root: {
      padding: theme.spacing(2),
    },
  }))(MuiDialogContent);
  
  const DialogActions = withStyles((theme) => ({
    root: {
      margin: 0,
      padding: theme.spacing(1),
    },
  }))(MuiDialogActions);

//function room
export default function Room(props) {    
    const curUser = JSON.parse(localStorage.getItem('curUser'));
    const socket = props.socket;
    const roomID = useParams().id;
    const [isLeaving, setIsLeaving] = useState(false);
    const [openInviteDialog, setOpenInviteDialog] = useState(false);
    const [usersOnline, setUsersOnline] = useState([]);

    const [room, setRoom] = useState({
        roomId: null,
        hostName: null,
        status: null,
        nextTurn: 1,
        type: "",
        password: "",
        timePerRound: "50",
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
    const [duration, setDuration] = useState(parseInt(room.timePerRound));
    const [changeKey, setChangeKey] = useState(1);

    useEffect(()=>{
        socket.on('roomJoined',  response => {setRoom(response)});
        socket.on('roomUpdated', response => {setRoom(response)});
        socket.on('gameResult', response => showGameResult(response));
        socket.on('updateUsersOnlineList', (response) => setUsersOnline(response)); 
        socket.on('setTimer', response => { setDuration(parseInt(response.duration)); setChangeKey(changeKey + 1); });
        socket.on('getDrawRequest', response => handleGetDrawRequest(response));
        socket.on('answerDrawRequest', response => handleAnswerDrawRequest(response));
    }, [room]);

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

    const handleLeaveRoom = () => {
        console.log('from leave room', room);
        if(room.status === 1 && (curUser._id === room.player1.id || curUser._id === room.player2.id)) {
            swal({
                title: "Bạn có chắc thoát trong khi đang chơi ?",
                text: "Bạn sẽ bị sử thua nếu thoát trận",
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
                    socket.emit("leaveRoom", curUser._id);
                    setIsLeaving(true);
                }
            });
        } else {
            socket.emit("leaveRoom", curUser._id);
            setIsLeaving(true);
        }
    }

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

    const handleDraw = () => {
        if(curUser._id === room.player1.id || curUser._id === room.player2.id) {
            socket.emit("drawRequest", {
                roomId: room.roomId,
                from: curUser._id === room.player1.id ? 1 : 2
            });
            swal({
                title: "Xin hòa",
                text: "Đang đợi đối thủ chấp nhận hòa...",
                icon: loading,
                button: "Hủy",
                dangerMode: true,
            });
        }
        else swal(`Room ${room.roomId}`, 'Bạn phải là một trong hai người chơi chính để thực hiện chức năng này', "error");
    }

    const handleGetDrawRequest = (response) => {
        if((response.from === 1 && curUser._id === room.player2.id)
            || (response.from === 2 && curUser._id === room.player1.id)) {
            swal({
                title: "Đối thủ muốn hòa với bạn",
                text: "Bạn có đồng ý ?",
                icon: "info",
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
                        winner: 0,
                        resultType: "draw" // Còn 1 type nữa là "winLose"
                    });
                } else {
                    socket.emit("deniedDrawRequest", {
                        roomId: room.roomId,
                        from: curUser._id === room.player1.id ? 1 : 2
                    })
                }
            });
        }
    }

    const handleAnswerDrawRequest = (response) => {
        if((response.from === 1 && curUser._id === room.player2.id)
            || (response.from === 2 && curUser._id === room.player1.id)) {
            swal({
                title: "Đối thủ từ chối đề nghị hòa",
                text: ":((((",
                icon: "error"
            })
        }
    }

    const handleOverTime = (id) => {
        if(id === 1 && curUser._id === room.player1.id) {
            socket.emit("gameResult", {
                room: {
                    ...room,
                    status: 0
                },
                winner: 2,
                resultType: "winLose" // Còn 1 type nữa là "draw"
            });
        } else if (id === 2 && curUser._id === room.player2.id) {
            socket.emit("gameResult", {
                room: {
                    ...room,
                    status: 0
                },
                winner: 1,
                resultType: "winLose" // Còn 1 type nữa là "draw"
            });
        }
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

    const handleTimer1 = () => {
        if(room.status === 0) return false;
        if(room.nextTurn === 1) {
            return true;
        }
        else return false
    }

    const handleTimer2 = () => {
        if(room.status === 0) return false;
        if(room.nextTurn === 2) {
            return true;
        }
        else return false
    }

    const showGameResult = (response) => {
        const { winner, loser, resultType} = response;
        if(resultType !== "winLose") {
            if(curUser._id === winner.id) {
                if(winner.first_elo < winner.final_elo) {
                    swal("Hòa", 
                        "Elo ban đầu: " + `${winner.first_elo}\n` +
                        "Tăng lên:    "  + `${winner.final_elo}` + " ↑", 
                        "info"
                    );
                } else if(winner.first_elo > winner.final_elo) {
                    swal("Hòa", 
                        "Elo ban đầu: " + `${winner.first_elo}\n` +
                        "Giảm xuống:  "  + `${winner.final_elo}` + " ↓", 
                        "info"
                    );
                } else {
                    swal("Hòa", 
                        "Elo ban đầu: " + `${winner.first_elo}\n` +
                        "Giữ nguyên:  "  + `${winner.final_elo}`, 
                        "info"
                    );
                }
            } else if (curUser._id === loser.id) {
                if(loser.first_elo < loser.final_elo) {
                    swal("Hòa", 
                        "Elo ban đầu: " + `${loser.first_elo}\n` +
                        "Tăng lên:    "  + `${loser.final_elo}` + " ↑", 
                        "info"
                    );
                } else if(loser.first_elo > loser.final_elo) {
                    swal("Hòa", 
                        "Elo ban đầu: " + `${loser.first_elo}\n` +
                        "Giảm xuống:  "  + `${loser.final_elo}` + " ↓", 
                        "info"
                    );
                } else {
                    swal("Hòa", 
                        "Elo ban đầu: " + `${loser.first_elo}\n` +
                        "Giữ nguyên:  "  + `${loser.final_elo}`, 
                        "info"
                    );
                }
            } else {
                swal("Kết quả", 
                    "Hòa", 
                    "success"
                );
            }
        } else {
            if(curUser._id === winner.id) {
                swal("Bạn là người chiến thắng", 
                    "Elo ban đầu: " + `${winner.first_elo}\n` +
                    "Tăng lên:    "  + `${winner.final_elo}` + " ↑", 
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

    const handleClickOpenInviteDialog = () => {
        let invitableUsers = usersOnline;
        for(let a=0; a < invitableUsers.length; a++)
        {
            invitableUsers[a].invited = false;
        }
        setUsersOnline(invitableUsers);
        console.log(usersOnline);
        setOpenInviteDialog(true);
    };

    const handleCloseInviteDialog = () => {
        setOpenInviteDialog(false);
    };
    
    const handleClickInvitePlayer = (invitedPlayer) =>{
        invitedPlayer.invited = true;
        let invitableUsers = usersOnline;
        for(let a=0; a < invitableUsers.length; a++)
        {
            if(invitableUsers[a].userId === invitedPlayer.userId)
            {
                invitableUsers[a] = invitedPlayer;
            }
        }
        invitableUsers = invitableUsers.concat({"socketId":"","userId":curUser._id,"userName":"","invited":false});
        setUsersOnline(invitableUsers);
        console.log(usersOnline);
        console.log( invitedPlayer);
        socket.emit("invitePlayer", {"playerInviteName":curUser.name,"room":roomID,"invitePlayerId":invitedPlayer.userId});
    };

    if(isLeaving) return <Redirect to="/" />
  
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
                                <Grid item xs={12} md={7} style={{minWidth: '705px'}}>
                                    <Grid container justify='center'>
                                        <CaroGame isStart={isMyTurn()} room={room} socket={socket}/>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12} md={5} style={{minWidth: '570px'}}>
                                    <Grid container direction='row' style={{marginBottom: '20px'}}>
                                        <Card style={{borderRadius: '20px', width:'45%'}}>
                                            <CardHeader 
                                                style={{backgroundColor: room.nextTurn === 1 ? 'red' : 'gray', textAlign: 'center'}}
                                                title="#Người chơi (X)"
                                            />
                                            <CardContent>
                                                <Typography variant="h5" component="h4" style={{textAlign: 'center'}}>{room.player1.name ? room.player1.name : "Trống"}</Typography>
                                                <CountDown id={1} isPlaying={handleTimer1()} duration={duration} onTimeEnd={handleOverTime} changeKey={changeKey}/>
                                            </CardContent>
                                            <CardActions>
                                                <Button onClick={() => joinPlayer(1)} variant="contained" size="small" color="primary" fullWidth disabled={room.player1.name ? true : false} style={{borderRadius: '20px'}}>Tham gia</Button>
                                            </CardActions>
                                        </Card>
                                        <Card style={{borderRadius: '20px', width:'45%', marginLeft: '9%'}}>
                                            <CardHeader 
                                                style={{backgroundColor: room.nextTurn === 2 ? 'red' : 'gray', textAlign: 'center'}}
                                                title="#Người chơi (O)"
                                            />
                                            <CardContent>
                                                <Typography variant="h5" component="h4" style={{textAlign: 'center'}}>{room.player2.name ? room.player2.name : "Trống"}</Typography>
                                                <CountDown id={2} isPlaying={handleTimer2()} duration={duration} onTimeEnd={handleOverTime} changeKey={changeKey}/>
                                            </CardContent>
                                            <CardActions>
                                                <Button onClick={() => joinPlayer(2)} variant="contained" size="small" color="primary" fullWidth disabled={room.player2.name ? true : false} style={{borderRadius: '20px'}}>Tham gia</Button>
                                            </CardActions>
                                        </Card>
                                    </Grid>
                                    <Grid container direction="row" style={{marginBottom:'30px'}} justify="center" >
                                        <Button onClick={() => room.status === 0 ? handlePlay() : handleDefeat()} variant="contained" color="primary">{room.status === 0 ? "Bẳt đầu" : "Đầu hàng"}</Button>
                                        <Button onClick={() => handleDraw()} style={{marginLeft:'30px'}} variant="contained" color="primary" disabled={room.status === 1 ? false : true}>Xin hòa</Button>
                                    </Grid>
                                    <Grid container direction="row" style={{marginBottom:'30px'}} justify="center" >
                                        <Button onClick={() => leavePlayer()} variant="contained" color="secondary" disabled={room.status === 0 ? false : true}>Làm khán giả</Button>
                                        <Button onClick={() => handleClickOpenInviteDialog()} style={{marginLeft:'30px', backgroundColor: '#5beb6f'}} variant="contained">Mời</Button>
                                        <Button onClick={() => handleLeaveRoom()} style={{marginLeft:'30px'}} variant="contained">Thoát phòng</Button>
                                    </Grid>
                                    <MessageRoom socket={socket} room={room}/>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={1}/>

                         {/* Invite players dialog */}
                        <Dialog  onClose={handleCloseInviteDialog} aria-labelledby="customized-dialog-title" open={openInviteDialog}>
                        <DialogTitle style = {{width:'300px'}} id="customized-dialog-title" onClose={handleCloseInviteDialog}>
                            Danh sách người chơi online
                        </DialogTitle>
                        <DialogContent dividers>
                            <Typography gutterBottom>
                            {usersOnline.map(item => 
                                item.userId !== curUser._id && item.canInvite !== false ?
                                <div key={item.userId}>
                                    <li >
                                        <span>{item.userName}
                                        <Button disabled = {item.invited} onClick={() => handleClickInvitePlayer(item)} style={{height:'20px',float: 'right'}} variant="contained" >Mời</Button>
                                        </span>                                  
                                    </li>
                                 </div>
                            : null
                            )}
                            </Typography>
                            
                        </DialogContent>
                        <DialogActions>
                            <Button autoFocus onClick={handleCloseInviteDialog} color="primary">
                            Close
                            </Button>
                        </DialogActions>
                        </Dialog>
                </Grid>
            </Grid>
        </div>    
    )
  }
