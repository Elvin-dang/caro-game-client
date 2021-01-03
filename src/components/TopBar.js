import React, { useState, useEffect, useRef } from 'react';
import {Card, AppBar, Button, Toolbar, Typography, IconButton, MenuItem, Menu, Avatar, Link } from '@material-ui/core';
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
import { Redirect } from 'react-router-dom';

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
      "&:hover": {
        textDecoration: 'none',
      }
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
  let curUser = null;

  if(localStorage.getItem('curUser')) curUser = JSON.parse(localStorage.getItem('curUser'));


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

  return (
      <AppBar position="static">
        <Toolbar>
          <Button
          ref={anchorRef}
          aria-controls={open ? 'menu-list-grow' : undefined}
          aria-haspopup="true"
          onClick={handleToggle}
          >
              { curUser ?
              <Avatar alt="avatar" src={curUser.avatar}></Avatar>
              :
              <AccountCircleIcon fontSize="large"/> 
              }
          </Button>
          <Typography variant="h6" className="title">
            {curUser ? curUser.name : ""}
          </Typography>
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
        </Toolbar>
      </AppBar>
  );
}