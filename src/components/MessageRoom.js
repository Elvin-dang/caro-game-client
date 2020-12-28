import React, { useState, useEffect, useRef } from 'react';
import MessageBox from './MessageBox';
export default function MessageRoom(props) {
    const {socket, room} = props;
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const messagesEndRef = useRef(null);
    const getUser = () =>
    {
        if( localStorage.getItem('curUser')){
            return JSON.parse(localStorage.getItem('curUser'));
        }
        else return 0;
    }

    const sendNewMessage = (e)=> {
        e.preventDefault()
        if(message!==""){
            const user= getUser();
            socket.emit("chat-room", {message: message, user: user, room: room}); //gửi event về server
            setMessage("");
        }
    }
    useEffect(()=>{
        socket.on('server-chat-room',response => {
            setMessages(draft => [ ...draft, {name: response.name, message:response.message}])
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        });
        }, []);
    return (
        <MessageBox messagesEndRef={messagesEndRef} messages={messages} addMessages={sendNewMessage} message={message} setMessage={setMessage}/>
    )
}