import React,{ useState, useEffect} from 'react';
import { useParams } from 'react-router-dom';
import {Card,CardContent, Grid, Link, Button,Paper} from '@material-ui/core';


export default function Room(props) {    
    const curUser = JSON.parse(localStorage.getItem('curUser'));

    const socket = props.socket;
    const roomID = useParams().id;
    
    const [room,setRoom] = useState([]);
    const [player1Name,setPlayer1Name] = useState(null);
    const [player2Name,setPlayer2Name] = useState(null);
    const [player1ID,setPlayer1ID] = useState(null);
    const [player2ID,setPlayer2ID] = useState(null);
    console.log('player 1 id: ' +player1ID);

   
    useEffect(()=>{
        socket.on('roomJoined',  (response) => {
            setRoom(response);
            setPlayer1ID(response[3]);
            setPlayer1Name(response[4]);
            setPlayer2ID(response[5]);
            setPlayer2Name(response[6])
        });
        socket.on('roomUpdated',(response) => {
            console.log('updated');
            setRoom(response);
            setPlayer1ID(response[3]);
            setPlayer1Name(response[4]);
            setPlayer2ID(response[5]);
            setPlayer2Name(response[6])
        });
    });

    const joinPlayer = (id) =>{
        if(id===1 && player1ID !== curUser._id)
        {
            setPlayer1Name(curUser.name);
            setPlayer1ID(curUser._id);
            room[4] = curUser.name;
            room[3] = curUser._id
        }
        else if (id===1 && player2ID === curUser._id)
        {
            setPlayer1Name(curUser.name);
            setPlayer1ID(curUser._id);
            room[4] = curUser.name;
            room[3] = curUser._id
            setPlayer2Name(null);
            setPlayer2ID(null);
            room[5] = null;
            room[6] = null;
        }
        else if (id===2 && player1ID !== curUser._id)
        {
            setPlayer2Name(curUser.name);
            setPlayer2ID(curUser._id);
            room[6] = curUser.name;
            room[5] = curUser._id
        }
        else if (id===2 && player1ID === curUser._id)
        {
            setPlayer2Name(curUser.name);
            setPlayer2ID(curUser._id);
            room[6] = curUser.name;
            room[5] = curUser._id
            setPlayer1Name(null);
            setPlayer1ID(null);
            room[4] = null;
            room[3] = null;


        }
        socket.emit("updateRoom",[roomID,room[3],room[4],room[5],room[6]]); 
    }
    const leavePlayer = () => {
        if(player1ID === curUser._id)
        {
            setPlayer1Name(null);
            setPlayer1ID(null);
            room[4] = null;
            room[3] = null;
        }
        if(player2ID === curUser._id)
        {
            setPlayer2Name(null);
            setPlayer2ID(null);
            room[5] = null;
            room[6] = null;
        }
        socket.emit("updateRoom",[roomID,room[3],room[4],room[5],room[6]]); 

    };
    console.log(room);

    return (
        <div>
            <div style={{textAlign:'center'}}>
                <h1>Room {roomID}</h1>
            </div>
            <Grid container >
                    <Grid container justify="center" >
                        <Paper style={{width:'600px',height:'600px',borderColor:'red'}}>bàn cờ</Paper>
                        <Card style={{width:'500x',padding:'15px'}}>
                            <h3>Người chơi 1: {player1Name ? player1Name : <Button onClick={() => { joinPlayer(1) }} style={{margin:'15px'}} variant="contained">Tham gia</Button>}</h3>
                            <h3>Người chơi 2: {player2Name ? player2Name : <Button onClick={() => { joinPlayer(2) }} style={{margin:'15px'}} variant="contained">Tham gia</Button>}</h3>
                            <Button onClick={() => { leavePlayer() }} style={{margin:'15px'}} variant="contained" color="secondary">Làm khán giả</Button>
                            <Paper style={{width:'300px',height:'300px',borderColor:'red'}}>Khung chat</Paper>
                        </Card>
                </Grid>
            </Grid>
        </div>    
    )
  }
