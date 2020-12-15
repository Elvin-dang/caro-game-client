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
    height: 400,
    backgroundColor:'#cfe8fc',
    position: 'fixed',
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
    justifyContent: 'center',
  }
}));

export default function MessageList(props) {
	const classes = useStyles();
	const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
	const [isRedirect, setIsRedirect] = useState(false);
	const messagesEndRef = useRef(null);
    const {socket} = props;
    //const { isLogin} = props;
    const isLogin = false;
    if(isLogin === true)
    {
        // if(curUser!==null){
        //     socket.emit("login", {
        //         id: curUser._id, 
        //         name: curUser.name
        //     }); 
        // }
    }//else setIsRedirect(true);


	const addMessages = () => {
		setMessages(m => [...m, {name: "Vinh", message:"hhaha"}]);
	};
    const getUserName = () =>
    {
        if( localStorage.getItem('curUser')){
            return JSON.parse(localStorage.getItem('curUser')).name;
        }
        else return 0;
    }
    const sendNewMessage = (m)=> {
        const name = getUserName();
        socket.emit("newMessage", {message: message, name: name}); //gửi event về server
        m.value = ""; 
    }


	useEffect(()=>{
        socket.on('updateMessage',response => {
            setMessages(draft => [ ...draft, {name: response.name, message:response.message}])});
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }, [messages]);


    return (
        <div>
        { (isRedirect === true) ? (<Redirect to='/signin' />) :
        (<div className={classes.root} id="messages"	>
            <div className={classes.messlist}>
                {messages.map((item, index) =>
                    <Message key={index} message={item}/>
                )}
                <div ref={messagesEndRef} />
            </div>
        	<div className={classes.searchIcon}>
      			<TextField fullWidth id="outlined-basic" label="Message" variant="outlined" onChange={e => setMessage(e.target.value)}/>
    			<button onClick={addMessages}>
    				<SendIcon color="primary" />
    			</button>
    		</div>
        </div>
        )
    }
    </div>
    )
}