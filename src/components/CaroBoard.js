import React from 'react';
import CaroSquare from './CaroSquare';
import CaroRow from './CaroRow';

const CaroBoard = ({ squares, onClick, winner }) => {
    const board = squares.map((row, index) => <CaroRow winner={winner} rowIdx={index} row={row} onClick={onClick} key={"r" + index}/>);
    const renderSquare = (i) => <CaroSquare value={squares[i]} onClick={() => onClick(i)}/>;

    return (
        <div>
            {board}
        </div>
    )
}

export default CaroBoard;
