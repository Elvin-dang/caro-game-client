import React, { useState, useEffect, useRef } from 'react';
import {Card, AppBar, Button, Toolbar, Typography, IconButton, MenuItem, Menu, Link } from '@material-ui/core';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuList from '@material-ui/core/MenuList';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import io from 'socket.io-client'
import userApi from '../api/userApi';
import { makeStyles } from '@material-ui/core/styles';

const useStyle = makeStyles((theme) => ({
  bottom_space: {
      marginBottom: 12, 
  },
  title: {
      flexGrow: 1,
  },
  logoutButton: {
      marginLeft: 10,
  },
  link: {
      textDecoration: 'none',
      flexGrow: 1,
  },
  linkProfile: {
      textDecoration: 'none',
  },
  large: {
      width: theme.spacing(9),
      height: theme.spacing(9),
  },
}));

export default function TopBar(props) {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);
  const classes = useStyle();
  const isLoggedIn = props.isLogin;

  let name = null;
  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
      if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
      }

      setOpen(false);
  };

  function handleListKeyDown(event) {
    if (event.key === 'Tab') {
    event.preventDefault();
    setOpen(false);
    }
  }
  
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
              <Button
              ref={anchorRef}
              aria-controls={open ? 'menu-list-grow' : undefined}
              aria-haspopup="true"
              onClick={handleToggle}
              >
                  <AccountCircleIcon fontSize="large"/>
              </Button>
              <Popper open={open} anchorEl={anchorRef.current} role={undefined} transition disablePortal>
              {({ TransitionProps, placement }) => (
                  <Grow
                  {...TransitionProps}
                  style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
                  >
                  <Paper>
                      <ClickAwayListener onClickAway={handleClose}>
                      <MenuList autoFocusItem={open} id="menu-list-grow" onKeyDown={handleListKeyDown}>
                          <Link href='/profile' className={classes.linkProfile}>
                              <MenuItem onClick={handleClose}>Profile</MenuItem>
                          </Link>
                          <Link href='/signout' className={classes.linkProfile}>
                              <MenuItem onClick={handleClose}>Sign out</MenuItem>
                          </Link>
                      </MenuList>
                      </ClickAwayListener>
                  </Paper>
                  </Grow>
              )}
              </Popper>
            </div>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
}