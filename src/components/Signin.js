import React, { useState    } from 'react';
import { Avatar, LinearProgress, Button, Typography, Link, Grid, Checkbox, FormControlLabel, TextField, CssBaseline, Container } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { Redirect } from 'react-router-dom';
import Facebook from './Facebook'
import Google from './Google'
import axios from 'axios'
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

export default function SignIn() {
  const [user, setUser] = useState({email: "", password: ""});
  const [isRedirect, setIsRedirect] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const classes = useStyles();

  const setRedirectTrue = ()=>{
    setIsRedirect(true);
  }
  const setIsLoadingTrue = ()=> {
    setIsLoading(true);
  }
  const setIsLoadingFalse = ()=> {
    setIsLoading(false);
  }
  const handleSubmit = async (e)=>{
    try{
      setIsLoading(true);
      e.preventDefault();
      await axios({
        method: 'post',
        url: process.env.REACT_APP_api_domain+"/user/signin",
        data: JSON.stringify(user),
        headers: {'Content-Type':'application/json'},
      }).then(data => {
        if(data.data.token)
          localStorage.setItem('login', JSON.stringify({
            login:true,
            token:data.data.token,
          }));
        setIsLoading(false);
        setIsRedirect(true);
      })
    }catch(e){
      setIsLoading(false);
      alert("Wrong email or password");
    }
  };
  return (
    <div>
    { (isRedirect === true) ? (<Redirect to='/' />) :
    (<Container component="main" maxWidth="xs">
      {isLoading ? <LinearProgress></LinearProgress> : <></>}
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <form method="form" id="form-data" className="form" onSubmit={handleSubmit} autoComplete="off">
          <TextField variant="outlined" margin="normal" required fullWidth id="email" label="Email Address" name="email" autoComplete="email" autoFocus 
            onChange={e => setUser({ ...user, email: e.target.value})}  />
          <TextField variant="outlined" margin="normal" required fullWidth name="password" label="Password" type="password" id="password"
            onChange={e => setUser({ ...user, password: e.target.value})} autoComplete="current-password" />
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
            Sign In
          </Button>
          <Grid container mb={2} className={classes.submit}>
            <Grid item xs >
              <Facebook setIsRedirect={setRedirectTrue} setIsLoadingTrue={setIsLoadingTrue} setIsLoadingFalse={setIsLoadingFalse}/>
            </Grid>
            <Grid item>
              <Google setIsRedirect={setRedirectTrue} setIsLoadingTrue={setIsLoadingTrue} setIsLoadingFalse={setIsLoadingFalse}/>
            </Grid>
          </Grid>
          <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link href="/signup" variant="body2">
                {"Don't have an account? Sign Up"}
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