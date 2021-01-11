import React,{useState, useEffect} from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import {Card,CardContent,Table,TableBody ,TableCell ,TableContainer ,TableHead ,Paper ,TableRow ,
TablePagination, Grid, Button,Modal,Input, CardActions, TextField } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import { Redirect, useHistory, Link} from 'react-router-dom';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import swal from 'sweetalert';
import loading from "./loading.svg"
//styles setting
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
  }
});

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

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




//function component
export default function Dashboard(props) {
  const history = useHistory();
  const [usersOnline,setUsersOnline] = useState([]);
  const [playRooms,setPlayRooms] = useState([]);
  const isLoggedIn = props.isLogin;
  const socket = props.socket;
  const curUser = JSON.parse(localStorage.getItem('curUser'));
  const classes = useStyles();
  
  const [modalStyle] = useState(getModalStyle);
  const [openCreateRoomModal, setOpenCreateRoomModal] = useState(false);
  const [openJoinRoomModal, setOpenJoinRoomModal] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [roomDialog, setRoomDialog] = useState({});
  const [roomDialogPlayer1,setRoomDialogPlayer1] = useState({});
  const [roomDialogPlayer2,setRoomDialogPlayer2] = useState({});
  const [newRoomType,setNewRoomType] = useState('unlock');
  const [newRoomPassword,setNewRoomPassword] = useState('');
  const [newRoomTimePerRound,setNewRoomTimePerRound] = useState('50');
  const [joinRoomPassword,setJoinRoomPassword] = useState('');
  const [roomSelected,setRoomSelected] = useState({});
  const [idJoinRoom, setIdJoinRoom] = useState('')
  const [isFindQuickGame,setIsFindQuickGame] = useState(false);
  const [isAcceptInvite,setIsAcceptInvite] = useState({"isaccept":false,"room":null});
  const [customTPR, setCustomTPR] = useState(false);
  const handleNewRoomTypeChange = (event) => {
    setNewRoomType(event.target.value);
  };

  const handleNewRoomTimePerRoundChange = (event) => {
    if(event.target.value === "custom") {
      setCustomTPR(true);
      setNewRoomTimePerRound("5");
    } else {
      setCustomTPR(false);
      setNewRoomTimePerRound(event.target.value);
    }
  };

  const handleNewRoomPasswordChange = (event) => {
    setNewRoomPassword(event.target.value);
  }

  const handleJoinRoomPasswordChange = (event) => {
    setJoinRoomPassword(event.target.value);
  }

  const handleIdJoinRoomChange= (event) => {
    setIdJoinRoom(event.target.value);
  }

  const handleClickOpenDialog = (room) => {
    setOpenDialog(true);
    setRoomDialog(room);
    setRoomDialogPlayer1(room.player1);
    setRoomDialogPlayer2(room.player2);
  };
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleOpenCreateRoomModal= () => {
    setOpenCreateRoomModal(true);
    setNewRoomPassword('');
    setNewRoomType('unlock');
    setNewRoomTimePerRound('50');
  }

  const handleCloseCreateRoomModal= () => {
    setOpenCreateRoomModal(false);
    setNewRoomPassword('');
    setNewRoomType('unlock');
  }

  const handleOpenJoinRoomModal= () => {
    setOpenJoinRoomModal(true);
  }

  const handleCloseJoinRoomModal= () => {
    setOpenJoinRoomModal(false);
    setJoinRoomPassword('');
    setRoomSelected({});
  }

  if(isLoggedIn === true)
  {
    if(curUser!==null){
      socket.emit("login", {
        id: curUser._id, 
        name: curUser.name
      }); 
    }
  }

  useEffect(()=>{
    socket.on('updateUsersOnlineList', (response) => setUsersOnline(response)); 
    socket.on('updateRoomsList',  (response) => setPlayRooms(response));
    socket.on('inviteToPlay', (response) => {
      console.log(response);
      if(response.invitePlayerId === curUser._id)
      {
        swal({
          title: "Bạn nhận được lời mời?",
          text: "Người chơi " + response.playerInviteName + " mời bạn vào room " + response.room + "!",
          icon: "warning",
          buttons: {
            cancel: "Từ chối",
            catch: {
              text: "Chấp nhận",
              value: "accept",
            }},
          dangerMode: false,
        })
        .then((value) => {
          if(value === "accept")
          {
            setIsAcceptInvite({"isaccept":true,"room":response.room});
          }     
        });
      }});
    socket.on('findedQuickGame',  (response) => {
      if(response.idPlayer1 === curUser._id || response.idPlayer2 === curUser._id)
      {
        setIsFindQuickGame(false);
        joinRoom(response.idRoom,'unlock',null);
        swal.close();
      }
    });
  }, []);
  
  const createRoom = () => {
    if(Number.parseInt(newRoomTimePerRound) < 5) swal("Thời gian tối thiểu là 5 giây", "", "warning");
    else if (Number.parseInt(newRoomTimePerRound) > 200) swal("Thời gian tối đa là 200 giây", "", "warning");
    else {
      socket.emit("createRoom", {'hostName':curUser.name,'newRoomType':newRoomType,'newRoomPassword':newRoomPassword,'newRoomTimePerRound':newRoomTimePerRound});
      socket.emit("joinRoom",  {"roomId":(playRooms.length + 1),"playerId":curUser._id});
      const path = "room/" + (playRooms.length + 1);
      history.push(path);
    }
  }

  const joinRoom = (id,roomType,roomPassword) => {
    if(roomType === 'unlock')
    {
      socket.emit("joinRoom", {"roomId":id,"playerId":curUser._id});
      const path = "room/" + id;
      history.push(path);
    }
    else 
    {
      handleOpenJoinRoomModal();
      setRoomSelected({'id':id,'password':roomPassword});
    }
  }

  const joinLockRoom = () =>{
    if(joinRoomPassword === roomSelected.password)
    {
      socket.emit("joinRoom", {"roomId":roomSelected.id,"playerId":curUser._id});
      const path = "room/" + roomSelected.id;
      history.push(path);
    }
    else {
      swal("Ôi không!", "Password không chính xác!", "error");
    }
  }

  const joinRoomById = () =>{
    for (let a=0; a < playRooms.length; a++) {
      if (playRooms[a].roomId == idJoinRoom) {
        console.log(playRooms[a]);
        joinRoom(playRooms[a].roomId,playRooms[a].type,playRooms[a].password)
        break;
      }
    }
  }

  const leaveRoom = () =>{
    socket.emit("leaveRoom", curUser._id);
  };

  const quickPlay = () =>{
    socket.emit("joinQuickGame", {"id":curUser._id,"elo":curUser.elo});
    setIsFindQuickGame(true);
    swal({
      title: "Chơi nhanh",
      text: "Đang tiến hành ghép cặp...",
      icon: loading,
      button: "Hủy",
      dangerMode: true,
    }).then(() => {
      setIsFindQuickGame(false);
      socket.emit("outQuickGame", {"id":curUser._id});
    });
  }

  if(isAcceptInvite.isaccept === true)
  {
    for (let a=0; a < playRooms.length; a++) {
      if (playRooms[a].roomId == isAcceptInvite.room) {
        console.log('accept invited');
        joinRoom(playRooms[a].roomId,playRooms[a].type,playRooms[a].password);

        break;
      }
    }
    setIsAcceptInvite({"isaccept":false,"room":null});

  }

  return (
    <div >
      {!isLoggedIn ? <Redirect to="/signin"/>: 
            <div>
              <div style={{textAlign: 'center',padding:'10px'}}>
                <Button style={{marginRight:'30px',backgroundColor:"green"}} variant="contained" color="primary" onClick={() => quickPlay()} >Chơi nhanh</Button>
                <Button variant="contained" color="primary" onClick={() => handleOpenCreateRoomModal()} >Tạo phòng mới</Button>
                <Input style={{marginLeft:'30px',marginRight:'10px'}} placeholder="Nhập ID phòng" onChange={handleIdJoinRoomChange}></Input> 
                <Button variant="contained"  onClick={() => joinRoomById()} >Tham gia</Button>
              </div>
              <Grid container >
                <Grid item xs={12}>
                  <Grid container justify="center" >
                  <TableContainer style={{width:'60%'}} component={Paper}>
                    <Table >
                      <TableHead>
                        <TableRow>
                          <StyledTableCell>ID room</StyledTableCell>
                          <StyledTableCell align="center">Người tạo</StyledTableCell>
                          <StyledTableCell align="center">Trạng thái</StyledTableCell>
                          <StyledTableCell align="center">Loại phòng</StyledTableCell>
                          <StyledTableCell align="center"></StyledTableCell>
                          <StyledTableCell align="center"></StyledTableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                      {playRooms.map((room) => (
                        <StyledTableRow key={room.roomId} >
                          <StyledTableCell component="th" scope="row">
                            {room.roomId}
                          </StyledTableCell>
                          <StyledTableCell align="center">{room.hostName}</StyledTableCell>
                          <StyledTableCell align="center">{room.status === 0 ? 'đang chờ' : 'đã chơi'}</StyledTableCell>
                          <StyledTableCell align="center" style={{color: room.type === 'lock' ? 'red' : 'blue'}}>{room.type === 'lock' ? 'Khóa' : 'Không khóa'}</StyledTableCell>
                          <StyledTableCell align="center"><Button color="primary" onClick={() => joinRoom(room.roomId,room.type,room.password)}>Tham gia</Button></StyledTableCell>
                          <StyledTableCell align="center"><Button color="primary" onClick={() => handleClickOpenDialog(room)}>Thông tin</Button></StyledTableCell>
                        </StyledTableRow>
                      ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                    <Card style={{margin:'10px'}}>
                      <CardContent style={{textAlign: 'left'}}>
                      <h2>List Users Online</h2>
                      {usersOnline.map(item =>
                            <li key={item.userId}><Button href={'/user/'+item.userId} size="small" style={{textTransform: 'none'}}>{item.userName}</Button></li>
                      )}
                      </CardContent>
                      <CardActions>
                          <Button href='/topPlayers' fullWidth color="secondary">
                              Bảng xếp hạng
                          </Button>
                      </CardActions>
                    </Card>
                    </Grid>
                  </Grid>
                </Grid>


                {/* Room information dialog */}
                <Dialog  onClose={handleCloseDialog} aria-labelledby="customized-dialog-title" open={openDialog}>
                  <DialogTitle style = {{width:'300px'}} id="customized-dialog-title" onClose={handleCloseDialog}>
                    Thông tin chi tiết
                  </DialogTitle>
                  <DialogContent dividers>
                    <Typography gutterBottom>
                      <p style={{fontWeight: 'bold', display: 'inline'}}>Room:</p> {roomDialog.roomId}
                    </Typography>
                    <Typography gutterBottom>
                      <p style={{fontWeight: 'bold', display: 'inline'}}>Người tạo:</p>  {roomDialog.hostName}
                    </Typography>
                    <Typography gutterBottom>
                      <p style={{fontWeight: 'bold', display: 'inline'}}>Trạng thái:</p>  {roomDialog.status === 0 ? 'đang chờ' : 'đã chơi'}
                    </Typography>
                    <Typography gutterBottom>
                      <p style={{fontWeight: 'bold', display: 'inline'}}>Loại phòng:</p>  {roomDialog.type === 'unlock' ? 'không khóa' : 'khóa'}
                    </Typography>
                    <Typography gutterBottom>
                      <p style={{fontWeight: 'bold', display: 'inline'}}>Player 1:</p>  {roomDialogPlayer1.name === null ? 'chưa vào' : roomDialogPlayer1.name}
                    </Typography>
                    <Typography gutterBottom>
                      <p style={{fontWeight: 'bold', display: 'inline'}}>Player 2:</p>  {roomDialogPlayer2.name === null ? 'chưa vào' : roomDialogPlayer2.name}
                    </Typography>
                  </DialogContent>
                  <DialogActions>
                    <Button autoFocus onClick={handleCloseDialog} color="primary">
                      Đóng
                    </Button>
                  </DialogActions>
                </Dialog>


                {/* Create New Room Modal */}
                  <Modal
                    open={openCreateRoomModal}
                    onClose={handleCloseCreateRoomModal}
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"
                  >
                    <div  style={modalStyle} className={classes.paper}>
                      <h2 >Tạo phòng chơi mới</h2>
                      <p >
                        Vui lòng chọn loại phòng chơi muốn tạo:
                      </p>
                      <RadioGroup aria-label="gender" name="gender1" value={newRoomType} onChange={handleNewRoomTypeChange}>
                        <FormControlLabel value="unlock" control={<Radio />} label="Phòng mở" />
                        <FormControlLabel value="lock" control={<Radio />} label="Phòng khóa" />
                      </RadioGroup>
                      <Input placeholder="Nhập password" onChange={handleNewRoomPasswordChange}></Input> 
                      <div style={{alignItems: 'center'}}>
                      <p >
                        Vui lòng chọn thời gian giới hạn mỗi lượt:
                      </p>
                      <RadioGroup aria-label="gender" name="gender2" defaultValue="50" onChange={handleNewRoomTimePerRoundChange}>
                        <FormControlLabel value="50" control={<Radio />} label="50 giây" i/>
                        <FormControlLabel value="100" control={<Radio />} label="100 giây" />
                        <FormControlLabel value="150" control={<Radio />} label="150 giây" />
                        <FormControlLabel value="custom" control={<Radio />} label="Tự quy định" />
                        {customTPR ? <Input placeholder="Thời gian (tối thiểu 5 giấy, tối đa 200 giây)" value={newRoomTimePerRound} onChange={(e) => setNewRoomTimePerRound(e.target.value)}/> : <></>}
                      </RadioGroup>
                      <Button variant="contained" color="primary" onClick={() => createRoom()} style={{margin:'10px'}}>Tạo phòng</Button>
                      </div>
                    </div>
                  </Modal>


                {/* Join Room Modal */}
                <div>
                  <Modal
                    open={openJoinRoomModal}
                    onClose={handleCloseJoinRoomModal}
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"
                  >
                    <div style={modalStyle} className={classes.paper}>
                      <h2 >Tham gia phòng</h2>
                      <p >
                        Vui lòng nhập mật khẩu phòng:
                      </p>
                      <Input placeholder="Nhập password" onChange={handleJoinRoomPasswordChange}></Input> 
                      <div style={{alignItems: 'center'}}>
                      <Button variant="contained" color="primary" onClick={() => joinLockRoom()} style={{margin:'10px'}}>Xác nhận</Button>
                      </div>
                    </div>
                  </Modal>
                </div>
            </div>
          }
    </div>
  );
}