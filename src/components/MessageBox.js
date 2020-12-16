import React, { useState, useEffect, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Message from './MessageItem';
import SendIcon from "@material-ui/icons/Send";
import TextField from '@material-ui/core/TextField';
import { Redirect } from 'react-router-dom';
const useStyles = makeStyles((theme) => ({
  root: {
//    overflow: 'hidden',
    margin: theme.spacing(2, 2),
    width: 400,
    height: 380,
    backgroundColor:'#cfe8fc',
//    position: 'fixed',
  },
  messlist: {
    flexGrow: 1,
    width: '92%',
    height: '75%',
    overflow: 'scroll',
    padding: theme.spacing(1, 2),
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
        <div className={classes.messlist}>
            {messages.map((item, index) =>
                <Message key={index} message={item}/>
            )}
            <div ref={messagesEndRef} />
        </div>
        <form action="#" onSubmit={addMessages} className={classes.searchIcon}>
          <TextField fullWidth id="outlined-basic" label="Message" variant="outlined" onChange={e => setMessage(e.target.value)} value={message} autoComplete="off" />
          <button type="submit">
            <SendIcon color="primary" />
          </button>
        </form>
      </div>
    )
}