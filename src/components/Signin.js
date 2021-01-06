import React, { useState    } from 'react';
import { Avatar, LinearProgress, Button, Typography, Grid, Checkbox, FormControlLabel, TextField, CssBaseline, Container } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { Redirect, Link } from 'react-router-dom';
import Facebook from './Facebook'
import Google from './Google'
import userApi from '../api/userApi';
import swal from 'sweetalert';

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
      const response = await userApi.signin(user);
      if(response.token) {
          localStorage.setItem('login', JSON.stringify({
            login:true,
            token:response.token,
          }));
          const curUser = await userApi.getCurUser();   
          localStorage.setItem('curUser', JSON.stringify(curUser));
        setIsLoading(false);
        setIsRedirect(true);
      } else {
          swal(response.message, "", "error");
      }
    } catch(err) {
      setIsLoading(false);
      if(err.response.status === 400) swal(err.response.data.details[0].message, "", "warning");
      else if(err.response.status === 401) swal(err.response.data.message, "", "error");
      else if(err.response.status === 403) swal(err.response.data.message, "", "error");
      else swal("Server không phản hồi", "", "error");
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
          Đăng nhập
        </Typography>
        <form method="form" id="form-data" className="form" onSubmit={handleSubmit} autoComplete="off">
          <TextField variant="outlined" margin="normal" required fullWidth id="email" label="Tài khoản" name="email" autoComplete="email" autoFocus 
            onChange={e => setUser({ ...user, email: e.target.value})}  />
          <TextField variant="outlined" margin="normal" required fullWidth name="password" label="Mật khẩu" type="password" id="password"
            onChange={e => setUser({ ...user, password: e.target.value})} autoComplete="current-password" />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Đăng nhập
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
              <Link to="/forget-password" variant="body2">
                Quên mật khẩu?
              </Link>
            </Grid>
            <Grid item>
              <Link to="/signup" variant="body2">
                {"Bạn chưa có tài khoản? Đăng ký"}
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