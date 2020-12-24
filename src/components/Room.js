import React,{ useState, useEffect} from 'react';
import { useParams } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import {Card, CardContent, Grid, Link, Button,Paper, Box} from '@material-ui/core';
import CaroGame from './CaroGame';
import MessageRoom from '../components/MessageRoom';
import swal from 'sweetalert';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';

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
    const [openInviteDialog, setOpenInviteDialog] = useState(false);
    const [usersOnline,setUsersOnline] = useState([]);

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
        socket.on('updateUsersOnlineList', (response) => setUsersOnline(response)); 
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
        if(room.player1.id === null || room.player2.id === null) swal("Oops!",'Cần 2 người chơi để bắt đầu',"warning");
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

    const handleClickOpenInviteDialog = () => {
        let invitableUsers = usersOnline;
        for(let a=0; a < invitableUsers.length; a++)
        {
            invitableUsers[a].invited = false;
        }
        setUsersOnline(invitableUsers);
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
        setUsersOnline(invitableUsers);
        console.log(invitedPlayer);
        socket.emit("invitePlayer", {"playerInviteName":curUser.name,"room":roomID,"invitePlayerId":invitedPlayer.userId});
    };
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
                                    <Button onClick={() => handleClickOpenInviteDialog()} style={{marginBottom:'30px', display: 'block'}} variant="contained" >Mời</Button>
                                    <MessageRoom socket={socket} roomId={room.roomId}/>
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
                                item.userId !== curUser._id ?
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
