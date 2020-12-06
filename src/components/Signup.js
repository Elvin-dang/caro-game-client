import React, { useState } from 'react';
import { Avatar, Button, Typography, Link, Grid, Checkbox, FormControlLabel, TextField, CssBaseline, Container } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { Redirect } from 'react-router-dom';
const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function SignUp() {
  const [user, setUser] = useState({email: "", password: "", name: ""});
  const [repassword, setRepassword] = useState("");
  const [isRedirect, setIsRedirect] = useState(false);
  const classes = useStyles();

  const handleSubmit = async (e)=>{
    try{
      if(user.password !== repassword)
      {
        alert("Wrong Re-type password. Please try again!");
      }else{
        e.preventDefault();
        await fetch(process.env.REACT_APP_api_domain+"/user/signup", {
          method: "POST",
          headers: {'Content-Type':'application/json'},
          body: JSON.stringify(user),
        }).then(response => response.json()).then(data=>{
          if(data.error)  alert(data.error)
          else{
              localStorage.setItem('login', JSON.stringify({
              login:true,
              token:data.token,
              data:data,
            }));
          }
          setIsRedirect(true);
        })
      }
    }catch(e){
      console.log(e);
    }
  };
  // const fblog = ()=>{
  //   setIsRedirect(true);
  // }

  return (
    <div>
    { (isRedirect === true) ? (<Redirect to='/' />) :
    (<Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <form method="form" id="form-data" className="form" onSubmit={handleSubmit} autoComplete="off">
          <TextField variant="outlined" margin="normal" required fullWidth id="name" label="Your name" name="name" 
            onChange={e => setUser({ ...user, name: e.target.value})} />
          <TextField variant="outlined" margin="normal" required fullWidth id="email" label="Email Address" name="email" autoComplete="email" 
            onChange={e => setUser({ ...user, email: e.target.value})}  />
          <TextField variant="outlined" margin="normal" required fullWidth name="password" label="Password" type="password" id="password"
            onChange={e => setUser({ ...user, password: e.target.value})} autoComplete="current-password" />
          <TextField variant="outlined" margin="normal" required fullWidth name="password" label="Re-type Password" type="password" id="repassword"
            onChange={e => setRepassword(e.target.value)} />
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Sign Up
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href="/signin" variant="body2">
                Have account already? Signin
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>)
  }
  </div>
  );
}