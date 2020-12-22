import React,{useState, useEffect} from 'react';
import { withStyles } from '@material-ui/core/styles';
import {Card,CardContent,Table,TableBody ,TableCell ,TableContainer ,TableHead ,Paper ,TableRow  ,TablePagination, Grid, Link, Button} from '@material-ui/core';
import io from 'socket.io-client'
import { Redirect, useHistory} from 'react-router-dom';

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

export default function Dashboard(props) {
  const history = useHistory();
  const [usersOnline,setUsersOnline] = useState([]);
  const [playRooms,setPlayRooms] = useState([]);
  const isLoggedIn = props.isLogin;
  const socket = props.socket;
  const curUser = JSON.parse(localStorage.getItem('curUser'));

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
    socket.emit("createRoom", curUser.name);
    joinRoom((playRooms.length + 1));
  }

  const joinRoom = (id) => {
    socket.emit("joinRoom", id);
    const path = "room/" + id;
    history.push(path);
  }

  const leaveRoom = () =>{
    socket.emit("leaveRoom", curUser._id);
  };

  return (
    <div >
      {!isLoggedIn ? <Redirect to="/signin"/>: 
            <div>
              <div style={{textAlign: 'center',padding:'10px'}}>
                <Button variant="contained" color="primary" onClick={() => createRoom()} >Tạo phòng mới</Button>
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
                          <StyledTableCell align="right"><Button color="primary" onClick={() => joinRoom(room.roomId)}>Tham gia</Button></StyledTableCell>
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
            </div>
          }
    </div>
  );
}