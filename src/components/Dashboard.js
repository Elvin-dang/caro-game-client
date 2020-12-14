import React,{useState, useEffect} from 'react';
import {Card, AppBar, Link, Button, Toolbar, Typography, IconButton, MenuItem, Menu } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import io from 'socket.io-client'


export default function TopBar(props) {
  const socket = io.connect(process.env.REACT_APP_api_domain_withouAPI);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [curUserName,setCurUserName] = useState("");
  const [curUserId,setCurUserId] = useState("");
  const [usersOnline,setUsersOnline] = useState([]);
  const [playRooms,setPlayRooms] = useState([]);
  let name=null ;
  const isLoggedIn = props.isLogin;
  // if(props.name!==undefined)
  // {
  //   name = props.name;
  // };

  console.log("islogged : " + isLoggedIn );
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  if( isLoggedIn===true)
  {
    const token = JSON.parse(localStorage.getItem('login')).token;
    console.log(token);

    fetch(process.env.REACT_APP_api_domain+"/user", {
      method: "GET",
      headers: {'Content-Type':'application/json',Authorization: token},
    }).then(response => response.json()).then(data=>{
      setCurUserId(data._id);
      setCurUserName(data.name);
    });
    console.log(curUserId);
    console.log(curUserName);
    name = curUserName;

    
    if(curUserName!=null){
      socket.emit("login",[curUserId,curUserName ]); 
    }
  }
  useEffect(()=>{
    socket.on('updateUsersOnlineList', (response) => {setUsersOnline(response)}); 
    socket.on('updateRoomsList',  (response) => {setPlayRooms(response)});
  });
  console.log(usersOnline);
  
  const createRoom = () => {
    socket.emit("createRoom",[curUserName]);
  }

  return (
    <div className="root">
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" className="menuButton" color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className="title">
            Hello {!isLoggedIn ? <Button href="/signin" color="inherit">Login</Button>: name}
          </Typography>
          
          {isLoggedIn && (
            <div>
              <IconButton
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                {}<AccountCircle />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={open}
                onClose={handleClose}
              >
                <MenuItem ><Link href="/profile">Profile</Link></MenuItem>
                <MenuItem ><Link href="/signout">Logout</Link></MenuItem>
              </Menu>
            </div>
          )}
        </Toolbar>
      </AppBar>
      {isLoggedIn && 
            <div>
              <Button onClick = {createRoom}>Tạo phòng mới</Button>

              <h3>List Users Online</h3>
              {usersOnline.map(item =>
                                <li key={item[1]}><span>{item[2]}</span></li>
                          )}
            </div>
          }
    </div>
  );
}