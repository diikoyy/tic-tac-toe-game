import React, { useEffect, useState } from "react";
import {
  GAME_STATE_DRAW,
  GAME_STATE_PLAYING,
  GAME_STATE_WIN,
  NO_PLAYER,
  NUMBER_OF_CIRCLES,
  PLAYER_1,
  PLAYER_2,
} from "../Constants";
import "../Game.css";
import { getComputerMove, isDraw, isWinner } from "../helper";
import Footer from "./Footer";
import GameCircle from "./GameCircle";
import Header from "./Header";

const GameBoard = () => {
  const [gameBoard, setGameBoard] = useState(Array(NUMBER_OF_CIRCLES).fill(NO_PLAYER));
  const [currentPlayer, setCurrentPlayer] = useState(PLAYER_1);
  const [gameState, setGameState] = useState(GAME_STATE_PLAYING);
  const [winPlayer, setWinPlayer] = useState(NO_PLAYER);

  console.log(gameBoard);

  /* Utilize useEffect Hook to make sure it's only run 
  when the component first mount
  If empty brackets => useEffect will only run once & it will run once
  when the component are first mounted
  */

  useEffect(() => {
    initGame();
  }, []);

  const initGame = () => {
    console.log("init game");
    setCurrentPlayer(PLAYER_1);
    setGameBoard(Array(NUMBER_OF_CIRCLES).fill(NO_PLAYER));
    setGameState(GAME_STATE_PLAYING);
  };

  /* 
  CREATE A CALLBACK FUNCTION & PASS IT FROM THE PARENT COMPONENT TO THE CHILD COMPONENT
  THEN THE CHILD COMPONENT WILL RAISE & CLICK EVENTS & BUBBLE IT BACK TO THE PARENT COMPONENT
  FOR THE PARENT TO HANDLE.

  When clicking the div via onClick event in GameCircle.js => call clickMethod function 
  in GameCircle.js => call the callback function onCircleClicked then back to the
  GameBoard.js => call the circleClicked function.

  Or

  When clicking the div via onClick event in GameCircle.js => call the callback function 
  onCircleClicked then back to the GameBoard.js => call the circleClicked function.
  */

  /* 
  // Case 1: Update the state based on the currentPlayer

  const circleClicked = (id) => {
    console.log(`circle clicked: ${id}`);

    // gameBoard[id] = PLAYER_1;

    // Update state for player
    gameBoard[id] = currentPlayer;
    setGameBoard(gameBoard);

    setCurrentPlayer(currentPlayer === PLAYER_1 ? PLAYER_2 : PLAYER_1);

    console.log(gameBoard);
  };
  */

  const initBoard = () => {
    /* 
    If we are using:
    for (let i = 0; i < NUMBER_OF_CIRCLES; i++) {
      renderCircle(i);
    }
    => It does not return anything as it returns an element & its board function
    simply calls the function & doesn't do anything with the output itself.

    => Solution: Build up an array & appends the output of this function to the array
    then return the entire array.
    */

    const circles = [];

    for (let i = 0; i < NUMBER_OF_CIRCLES; i++) {
      circles.push(renderCircle(i));
    }
    return circles;
  };

  const suggestMove = () => {
    // Call the circleClicked and id is the random number from the getComputerMove
    circleClicked(getComputerMove(gameBoard));
  };

  const circleClicked = (id) => {
    console.log(`circle clicked: ${id}`);

    /*
    Double check that if circle is clicked then can not click anymore
    set circle is clicked is not 0 & if it is not 0 then it can not be clicked
    => exit function
    */
    if (gameBoard[id] !== NO_PLAYER) return;

    /*
    If the game is in the win, draw, idle mode => Exit the function
    */
    if (gameState !== GAME_STATE_PLAYING) return;

    /* 
    // Case 2: Spread Syntax

    Avoid mutate/modify the original array (the state)
     => it can update the state by adding spread operator below
     we just to modify on the copy array (board instead of gameBoard) then setting the state
     with the copy of the array rather than the original array
     */

    /* const board = [...gameBoard];
    // Update the clone of the array
    board[id] = currentPlayer;
    // Then set it back to the original array
    setGameBoard(board); */

    // Case 3: Using Map method
    if (isWinner(gameBoard, id, currentPlayer)) {
      /*  
      As we change the state from a progress to a win condition
      => It happens asynchronously => Can't guarantee when it actually occurs
      => the code continues to change the current player to the next player
      
      Solution: Create another state variable and call it props winPlayer
      => setWinPlayer(currentPlayer);
      => It will hold the currentPlayer at that current position
      before it gets updated
      */
      setGameState(GAME_STATE_WIN);
      setWinPlayer(currentPlayer);
    }

    if (isDraw(gameBoard, id, currentPlayer)) {
      setGameState(GAME_STATE_DRAW);
      setWinPlayer(NO_PLAYER);
    }

    setGameBoard((prev) => {
      return prev.map((circle, index) => {
        if (index === id) return currentPlayer;
        return circle;
      });
    });

    /* 
    Just update the state of variable and don't make any copies of the array.
    The reason is because when using primitive object (int, number, bool) in the state 
    => Just update them (update the value in the state)
    */
    setCurrentPlayer(currentPlayer === PLAYER_1 ? PLAYER_2 : PLAYER_1);

    console.log(`gameBoard: ${gameBoard}`);
    console.log(`currentPlayer: ${currentPlayer}`);
  };

  // Helper Function
  const renderCircle = (id) => {
    return (
      <GameCircle
        key={id}
        className={`player_${gameBoard[id]}`}
        id={id}
        onCircleClicked={circleClicked}
      />
    );
  };

  return (
    <>
      <Header
        currentPlayer={currentPlayer}
        gameState={gameState}
        winPlayer={winPlayer}
      />

      {/* fr stands for "fractional unit" => 1fr = 25% of total 4 columns (25%
      width) */}
      <div className="gameBoard">{initBoard()}</div>
      <Footer
        onNewGameClick={initGame}
        onSuggestClick={suggestMove}
        gameState={gameState}
      />
    </>
  );
};

export default GameBoard;
