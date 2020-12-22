import React,{useState, useEffect} from 'react';
import { withStyles } from '@material-ui/core/styles';
import {Card,CardContent,Table,TableBody ,TableCell ,TableContainer ,TableHead ,Paper ,TableRow ,
TablePagination, Grid, Link, Button,Modal,Input } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import io from 'socket.io-client'
import { Redirect, useHistory} from 'react-router-dom';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';


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
  },
});

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
  
  const [openCreateRoomModal, setOpenCreateRoomModal] = useState(false);
  const [openJoinRoomModal, setOpenJoinRoomModal] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [roomDialog, setRoomDialog] = useState({});
  const [roomDialogPlayer1,setRoomDialogPlayer1] = useState({});
  const [roomDialogPlayer2,setRoomDialogPlayer2] = useState({});
  const [newRoomType,setNewRoomType] = useState('unlock');
  const [newRoomPassword,setNewRoomPassword] = useState('');
  const [joinRoomPassword,setJoinRoomPassword] = useState('');
  const [roomSelected,setRoomSelected] = useState({});
  console.log(playRooms);
  const handleNewRoomTypeChange = (event) => {
    setNewRoomType(event.target.value);
  };

  const handleNewRoomPasswordChange = (event) => {
    setNewRoomPassword(event.target.value);
  }

  const handleJoinRoomPasswordChange = (event) => {
    setJoinRoomPassword(event.target.value);
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
  }, []);
  
  const createRoom = () => {
    socket.emit("createRoom", {'hostName':curUser.name,'newRoomType':newRoomType,'newRoomPassword':newRoomPassword});
    socket.emit("joinRoom", playRooms.length + 1);
    const path = "room/" + playRooms.length + 1;
    history.push(path);
  }

  const joinRoom = (id,roomType,roomPassword) => {
    if(roomType === 'unlock')
    {
      socket.emit("joinRoom", id);
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
    console.log(roomSelected.password)
    if(joinRoomPassword === roomSelected.password)
    {
      socket.emit("joinRoom", roomSelected.id);
      const path = "room/" + roomSelected.id;
      history.push(path);
    }
    else {
      alert("Password không chính xác !!!");
    }
  }

  const leaveRoom = () =>{
    socket.emit("leaveRoom", curUser._id);
  };


  return (
    <div >
      {!isLoggedIn ? <Redirect to="/signin"/>: 
            <div>
              <div style={{textAlign: 'center',padding:'10px'}}>
                <Button variant="contained" color="primary" onClick={() => handleOpenCreateRoomModal()} >Tạo phòng mới</Button>
              </div>
              <Grid container >
                <Grid item xs={12}>
                  <Grid container justify="center" >
                  <TableContainer style={{width:'60%'}} component={Paper}>
                    <Table >
                      <TableHead>
                        <TableRow>
                          <StyledTableCell>ID room</StyledTableCell>
                          <StyledTableCell align="right">Người tạo</StyledTableCell>
                          <StyledTableCell align="right">Trạng thái</StyledTableCell>
                          <StyledTableCell align="right">Loại phòng</StyledTableCell>
                          <StyledTableCell align="right"></StyledTableCell>
                          <StyledTableCell align="right"></StyledTableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                      {playRooms.map((room) => (
                        <StyledTableRow key={room.roomId} >
                          <StyledTableCell component="th" scope="row">
                            {room.roomId}
                          </StyledTableCell>
                          <StyledTableCell align="right">{room.hostName}</StyledTableCell>
                          <StyledTableCell align="right">{room.status === 0 ? 'đang chờ' : 'đã chơi'}</StyledTableCell>
                          <StyledTableCell align="right" style={{color: room.type === 'lock' ? 'red' : 'blue'}}>{room.type === 'lock' ? 'Lock' : 'Unlock'}</StyledTableCell>
                          <StyledTableCell align="right"><Button color="primary" onClick={() => joinRoom(room.roomId,room.type,room.password)}>Tham gia</Button></StyledTableCell>
                          <StyledTableCell align="right"><Button color="primary" onClick={() => handleClickOpenDialog(room)}>Thông tin</Button></StyledTableCell>
                        </StyledTableRow>
                      ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                    <Card style={{margin:'10px'}}>
                      <CardContent style={{textAlign: 'left'}}>
                      <h2>List Users Online</h2>
                      {usersOnline.map(item =>
                            <li key={item.userId}><span>{item.userName}</span></li>
                      )}
                      </CardContent>
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
                      Room: {roomDialog.roomId}
                    </Typography>
                    <Typography gutterBottom>
                      Người tạo: {roomDialog.hostName}
                    </Typography>
                    <Typography gutterBottom>
                      Trạng thái: {roomDialog.status === 0 ? 'đang chơi' : 'đã chơi'}
                    </Typography>
                    <Typography gutterBottom>
                      Loại phòng: {roomDialog.type}
                    </Typography>
                    <Typography gutterBottom>
                      Player 1: {roomDialogPlayer1.name === null ? 'chưa vào' : roomDialogPlayer1.name}
                    </Typography>
                    <Typography gutterBottom>
                      Player 2: {roomDialogPlayer2.name === null ? 'chưa vào' : roomDialogPlayer2.name}
                    </Typography>
                  </DialogContent>
                  <DialogActions>
                    <Button autoFocus onClick={handleCloseDialog} color="primary">
                      Close
                    </Button>
                  </DialogActions>
                </Dialog>


                {/* Create New Room Modal */}
                <div>
                  <Modal
                    open={openCreateRoomModal}
                    onClose={handleCloseCreateRoomModal}
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"
                    style={{paddingLeft:"30%",paddingTop:'20px'}}
                  >
                    <div style={{backgroundColor:'white',width:'400px',height:'300px',padding:'20px'}}>
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
                      <Button variant="contained" color="primary" onClick={() => createRoom()} style={{margin:'10px'}}>Tạo phòng</Button>
                      </div>
                    </div>
                  </Modal>
                </div>


                {/* Join Room Modal */}
                <div>
                  <Modal
                    open={openJoinRoomModal}
                    onClose={handleCloseJoinRoomModal}
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"
                    style={{paddingLeft:"30%",paddingTop:'20px'}}
                  >
                    <div style={{backgroundColor:'white',width:'400px',height:'300px',padding:'20px'}}>
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