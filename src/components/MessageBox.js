import React, { useState, useEffect, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Message from './MessageItem';
import SendIcon from "@material-ui/icons/Send";
import TextField from '@material-ui/core/TextField';
import { Redirect } from 'react-router-dom';
const useStyles = makeStyles((theme) => ({
  root: {
//    overflow: 'hidden',
    width: '100%',
    height: 380,
    backgroundColor:'#cfe8fc',
    padding: '10px',
//    position: 'fixed',
  },
  messList: {
    flexGrow: 1,
    width: '100%',
    height: '75%',
    overflow: 'auto',
    // margin: theme.spacing(1),
  },
  searchIcon: {
    margin: theme.spacing(2, 2),
    display: 'flex',
    alignItems: 'center',
//    justifyContent: 'center',
  }
}));

export default function MessageList(props) {
  const classes = useStyles();
  const { messagesEndRef, addMessages, messages, message, setMessage } = props;
  return (
      <div className={classes.root} id="messages"  >
        <div className={classes.messList}>
            {messages.map((item, index) =>
                <Message key={index} message={item}/>
            )}
            <div ref={messagesEndRef} />
        </div>
        <form action="#" onSubmit={addMessages} className={classes.searchIcon}>
          <TextField fullWidth id="outlined-basic" label="Tin nhắn" variant="outlined" onChange={e => setMessage(e.target.value)} value={message} autoComplete="off" />
          <button type="submit" style={{marginLeft: "10px", height: "100%"}}>
            <SendIcon color="primary" />
          </button>
        </form>
      </div>
    )
}