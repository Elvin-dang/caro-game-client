import React,{ useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Avatar, List, Divider, ListItemText, ListItemIcon, ListItem } from '@material-ui/core';
import userApi from '../api/userApi';

const useStyles = makeStyles((theme) => ({
    root: {
      width: '100%',
      maxWidth: 360,
      backgroundColor: theme.palette.background.paper,
    },
  }));
function ListItemLink(props) {
  return <ListItem button component="a" {...props} />;
}
export default function TopPlayer() { 
    const [topPlayers, setTopPlayers] = useState([]);
    const classes = useStyles();
    useEffect(()=>{
        const fetchTopPlayers = async()=>{
            const response = await userApi.getTopPlayers();
            setTopPlayers(response);
        };
        fetchTopPlayers();
    }, [])
    return (
        <div className={classes.root}>
        <List component="nav" aria-label="rank">
          {topPlayers.map((item, index) =>
          <ListItemLink key={index} href={'/user/'+item._id} >
              <ListItemIcon>
                <Avatar alt="avatar" src={item.avatar} />
              </ListItemIcon>
              <ListItemText primary={item.name} />
          </ListItemLink>
          )}
        </List>
        <Divider />
      </div>
    );
}