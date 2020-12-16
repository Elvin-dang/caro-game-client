import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CaroSquare from './CaroSquare';

const useStyles = makeStyles((theme) => ({
    boardRow: {
        '&:after': {
            clear: 'both',
            content: '',
            display: 'table',
        }
    }
}));

const winCondition = 5;

const CaroRow = ({ row, rowIdx, winner, onClick, isStart }) => {
    const squareRow = row.map((square, index) => {
        let win = false;

        if(winner) {
            if(winner.direction === "ToRight" &&
            index >= winner.x && index <= winner.x + winCondition - 1 &&
            rowIdx === winner.y) win = true;

            if (winner.direction === "ToDown" &&
            rowIdx >= winner.y && rowIdx <= winner.y + winCondition - 1 && 
            index === winner.x) win = true;
        
            if (winner.direction === "ToRightDown" &&
            index >= winner.x && index <= winner.x + winCondition - 1 && 
            index - winner.x === rowIdx - winner.y) win = true;

            if (winner.direction === "ToLeftDown" &&
            index <= winner.x && index >= winner.x - winCondition + 1 && 
            winner.x - index === rowIdx - winner.y) win = true;
        }

        return <CaroSquare isWinSquare={win} value={square} onClick={() => onClick(rowIdx, index)} isStart={isStart} key={"s" + index}/>
    });

    return (
        <div className={useStyles().boardRow}>
            {squareRow}
        </div>
    )
}

export default CaroRow;