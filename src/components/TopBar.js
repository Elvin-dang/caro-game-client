import React,{useState, useEffect} from 'react';
import {Card, AppBar, Link, Button, Toolbar, Typography, IconButton, MenuItem, Menu } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import io from 'socket.io-client'
import userApi from '../api/userApi';


export default function TopBar(props) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const isLoggedIn = props.isLogin;
  // if(props.name!==undefined)
  // {
  //   name = props.name;
  // };
  let name = null;
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  
  const getUserName = () =>
  {
    if( localStorage.getItem('curUser')){
      name = JSON.parse(localStorage.getItem('curUser')).name;
    }
  }
  
  getUserName();
  

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
    </div>
  );
}