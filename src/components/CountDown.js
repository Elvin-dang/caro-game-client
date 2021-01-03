import React, { useState, useEffect } from "react";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import { makeStyles } from '@material-ui/core/styles';

const Styles = makeStyles((theme) => ({
    h1: {
        fontFamily: "Roboto",
        textAlign: "center",
        marginBottom: "40px"
    },
    timer_wrapper: {
        marginTop: "10px",
        display: "flex",
        justifyContent: "center",
    },
    timer: {
        fontFamily: "Montserrat",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
    text: {
        color: "#aaa",
    },
    value: {
        fontSize: "40px",
    },
    info: {
        maxWidth: "360px",
        margin: "40px auto 0",
        textAlign: "center",
        fontSize: "16px",
    }
}));

const renderTime = ({ remainingTime, elapsedTime }) => {
    const classes = Styles();
    if(remainingTime === 0) {
        return <div className={classes.timer}>Hết thời gian</div>;
    }

    return (
        <div className={classes.timer}>
            <div className={classes.text}>Còn lại</div>
            <div className={classes.value}>{remainingTime}</div>
            <div className={classes.text}>Giây</div>
        </div>
    );
};

const CountDown = ({ id, isPlaying, duration, onTimeEnd, changeKey }) => {
    const classes = Styles();

    return (
        <div className={classes.timer_wrapper}>
            <CountdownCircleTimer
            key={isPlaying || changeKey}
            isPlaying={isPlaying}
            duration={duration}
            colors={[["#004777", 0.33], ["#F7B801", 0.33], ["#A30000"]]}
            onComplete={() => {
                onTimeEnd(id);
                return [false, 1000];
            }}
            >
            {renderTime}
            </CountdownCircleTimer>
        </div>
    );
}

export default CountDown;
