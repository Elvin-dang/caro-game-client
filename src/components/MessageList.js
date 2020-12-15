import React, { useState, useEffect, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Message from './MessageItem';
import Grid from '@material-ui/core/Grid';
import SendIcon from "@material-ui/icons/Send";
import TextField from '@material-ui/core/TextField';


const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
//    overflow: 'hidden',
    overflow: 'scroll',
    margin: theme.spacing(2, 2),
    padding: theme.spacing(1, 2),
    width: 400,
    height: 300,
    backgroundColor:'#cfe8fc',
    position: 'fixed',
  },
  searchIcon: {
  	margin: theme.spacing(2, 0),
//   height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }
}));

export default function MessageList(props) {
	const classes = useStyles();
	const [messages, setMessages] = useState([]);
	
	const messagesEndRef = useRef(null);

	const scrollToBottom = () => {
		messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
	}
	const addMessages = () => {
		setMessages(m => [...m, {name: "Vinh", message:"hhaha"}]);
	};
	useEffect(scrollToBottom, [messages]);


    return (
        <div className={classes.root} id="messages"	>
            {messages.map(item =>
                <Message key={item.id} message={item}/>
            )}
            <div ref={messagesEndRef} />
        	<div className={classes.searchIcon}>
      			<TextField fullWidth id="outlined-basic" label="Message" variant="outlined" />
    			<button onClick={addMessages}>
    				<SendIcon color="primary" />
    			</button>
    		</div>
        </div>
    )

}