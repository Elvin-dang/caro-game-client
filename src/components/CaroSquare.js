import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    square: {
        background: '#fff',
        border: '1px solid #999',
        float: 'left',
        fontSize: '24px',
        fontWeight: 'bold',
        lineHeight: '34px',
        height: '34px',
        marginRight: '-1px',
        marginTop: '-1px',
        padding: '0px',
        textAlight: 'center',
        minWidth: '34px',
        borderRadius: '0',
        '&:focus': {
            outline: 'none',
        }
    },
    squareHightLight: {
        color: 'red',
        background: 'yellow',
        fontWeight: 'bold',
    }
}));

const CaroSquare = ({ isWinSquare, value, onClick }) => {
    const classes = useStyles();

    return isWinSquare ? (
        <Button className={[classes.square, classes.squareHightLight]} onClick={onClick}>
            {value}
        </Button>
    ) : (
        <Button className={classes.square} onClick={onClick} disableRipple={true}>
            {value}
        </Button>
    )
}

export default CaroSquare;
