import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Grid, CircularProgress, Button } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import userApi from '../api/userApi';
import { makeStyles } from '@material-ui/core/styles';

function Alert(props) {
  return <MuiAlert style={{width: '100%'}} elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        '& > * + *': {
            marginTop: theme.spacing(2),
        },
    },
    linkProfile: {
        textDecoration: 'none'
    }
}));

function ActiveAccount() {
    const { token } = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [isSuccess, setIsSuccess] = useState(true);
    const classes = useStyles();

    useEffect(() => {
        const checkActivation = async () => {
            try {
                const response = await userApi.activeAccount(token);
                if(response.result) {
                    setIsLoading(false);
                    setIsSuccess(true);
                } else {
                    setIsLoading(false);
                    setIsSuccess(false);
                }
            } catch(err) {
                setIsLoading(false);
                setIsSuccess(false);
            }
        }

        checkActivation();
    }, [token]);

    return (
        <Grid className={classes.root} container justify="center" alignItems="center">
            <Grid item xs={2}/>
            {isLoading ? <CircularProgress/>
            : (
                <Grid item xs={8}>
                    <Grid container justify="center" alignItems="center" spacing={2}>
                        <Grid item xs={12}>
                            {isSuccess ? <Alert severity="success">Kích hoạt tài khoản thành công</Alert>
                            : <Alert severity="error">Kích hoạt tài khoản thất bại</Alert> }
                        </Grid>
                        <Grid item xs={12}>
                            <Grid container justify="center" alignItems="center">
                                <Link to='/signin' className={classes.linkProfile}>
                                    <Button variant="outlined" color="primary">
                                        Đi đến đăng nhập
                                    </Button>
                                </Link>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>  
            )
            }
            <Grid item xs={2}/>
        </Grid>
    )
}

export default ActiveAccount;
