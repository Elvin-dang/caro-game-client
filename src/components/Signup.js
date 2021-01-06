import React, { useState } from 'react';
import { Avatar, Button, Typography, Grid, Checkbox, FormControlLabel, TextField, CssBaseline, Container, LinearProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { Link, Redirect } from 'react-router-dom';
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

export default function SignUp() {
  const [user, setUser] = useState({email: "", password: "", name: ""});
  const [isLoading, setIsLoading] = useState(false);
  const [repassword, setRepassword] = useState("");
  const [isRedirect, setIsRedirect] = useState(false);
  const classes = useStyles();

  const handleSubmit = async (e)=>{
    try{
      setIsLoading(true);
      e.preventDefault();
      if(user.password !== repassword)
      {
        swal("Nhập lại mật khẩu không trùng khớp", "", "info");
        setIsLoading(false);
      }else{
        const response = await userApi.signup(user);
        swal(response.message, "", "success");
        setIsLoading(false);
        setIsRedirect(true);
      }
    }catch(err){
      setIsLoading(false);
      if(err.response.status === 400) swal(err.response.data.details[0].message, "", "warning");
      else if(err.response.status === 401) swal(err.response.data.message, "", "error");
      else if(err.response.status === 403) swal(err.response.data.message, "", "error");
      else swal("Server không phản hồi", "", "error");
    }
  };

  return (
    <div>
    { (isRedirect === true) ? (<Redirect to='/signin' />) :
    (<Container component="main" maxWidth="xs">
      {isLoading ? <LinearProgress></LinearProgress> : <></>}
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Đăng ký
        </Typography>
        <form method="form" id="form-data" className="form" onSubmit={handleSubmit} autoComplete="off">
          <TextField variant="outlined" margin="normal" required fullWidth id="name" label="Tên của bạn" name="name" 
            onChange={e => setUser({ ...user, name: e.target.value})} />
          <TextField variant="outlined" margin="normal" required fullWidth id="email" label="Tên đăng nhập (Email)" name="email" autoComplete="email" 
            onChange={e => setUser({ ...user, email: e.target.value})}  />
          <TextField variant="outlined" margin="normal" required fullWidth name="password" label="Mật khẩu" type="password" id="password"
            onChange={e => setUser({ ...user, password: e.target.value})} />
          <TextField variant="outlined" margin="normal" required fullWidth name="password" label="Nhập lại mật khẩu" type="password" id="repassword"
            onChange={e => setRepassword(e.target.value)} />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Đăng ký
          </Button>
          <Grid container justify="center" alignItems="center">
              <Link to="/signin" variant="body2">
                Bạn đã có tài khoản? Đăng nhập
              </Link>
          </Grid>
        </form>
      </div>
    </Container>)
  }
  </div>
  );
}