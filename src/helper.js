export const isWinner = (gameBoard, currentMove, currentPlayer) => {
  /* Mutate the state but by reference (gameBoard), not by Value
  Because updating the currentMove meaning update the state
  gameBoard[currentMove] = currentPlayer 
  So we need to change solution into copying the array 
  => Avoid mutating the state (Not mutate the state)
  This ensures that the original gameBoard remains unchanged, 
  preventing unintended side effects.
  */
  let board = [...gameBoard];
  board[currentMove] = currentPlayer;

  const winLines = [
    [0, 1, 2, 3],
    [4, 5, 6, 7],
    [8, 9, 10, 11],
    [12, 13, 14, 15],
    [0, 4, 8, 12],
    [1, 5, 9, 13],
    [2, 6, 10, 14],
    [3, 7, 11, 15],
    [0, 5, 10, 15],
    [3, 6, 9, 12],
  ];

  //   i < winLines.length: It enumerates through our winning combinations
  for (let i = 0; i < winLines.length; i++) {
    // Destructure the winLines into a helper array (4 counters)
    const [c1, c2, c3, c4] = winLines[i];

    // Check whether the same player is in all winning circles => Win (true)

    /* 
    gameBoard[c1] > 0:
    This condition checks if the cell at index c1 is not empty. In Tic-Tac-Toe, 
    empty cells are usually represented by 0.
    If c1 is empty, there's no possibility of a winning line, 
    so the rest of the conditions are not evaluated.
    
    gameBoard[c1] === gameBoard[c2]:
    This condition checks if the cells at indices c1 and c2 have the same value. 
    This means both cells must contain the same player's mark (either 1 or 2).
    
    gameBoard[c2] === gameBoard[c3]:
    Similar to the previous condition, this checks if the cells at indices 
    c2 and c3 have the same value.
    
    gameBoard[c3] === gameBoard[c4]:
    This condition checks if the cells at indices c3 and c4 have the same value.
    Overall, the if condition is true only when:

    All four cells (c1, c2, c3, and c4) are not empty.
    All four cells contain the same player's mark.
    */

    if (
      board[c1] > 0 &&
      board[c1] === board[c2] &&
      board[c2] === board[c3] &&
      board[c3] === board[c4]
    ) {
      return true;
    }
  }
  return false;
};

export const isDraw = (gameBoard, currentMove, currentPlayer) => {
  // Store the move for the current player
  let board = [...gameBoard];
  board[currentMove] = currentPlayer;

  let count = board.reduce(
    (previousValue, currentValue) => previousValue + (currentValue === 0),
    0
  );

  console.log(`count: ${count}`);

  // return boolean (true)
  return count === 0;
};

/*
Pick a random number of all the remaining circles that have not yet been played.
*/
const getRandomComputerMove = (gameBoard) => {
  let validMoves = [];

  for (let i = 0; i < gameBoard.length; i++) {
    // No player is currently occupying that circle
    // => Simply pushing the index from gameBoard into array
    if (gameBoard[i] === 0) {
      validMoves.push(i);
    }
  }

  // random move in the validMoved array (pick an index)
  // If 5 empty circles => pick a number between 0 and 4
  let randomMove = Math.floor(Math.random() * validMoves.length);

  // return the index which is held in validMoves array, picks by the random number
  return validMoves[randomMove];
};

const getPosition = (gameBoard, moveChecks) => {
  // Loop for each of move checks (vertical, horizontal and diagnose)
  for (let check = 0; check < moveChecks.length; check++) {
    // Loop for each of check (4 elements of the indexes array)
    // Loop from 0 -> max in the object by using step
    // 4 cols for vertical, 4 rows for horizontal, left diagnose, right diagnose
    for (let i = 0; i < moveChecks[check].max; i += moveChecks[check].step) {
      // Constructs a string series by concatenating the values of the four entries in the current check.
      // First entry + Second entry + Third entry + Fourth entry
      // 0 - 4 - 8 - 12
      let series =
        gameBoard[i + moveChecks[check].indexes[0]].toString() +
        gameBoard[i + moveChecks[check].indexes[1]].toString() +
        gameBoard[i + moveChecks[check].indexes[2]].toString() +
        gameBoard[i + moveChecks[check].indexes[3]].toString();

      switch (series) {
        // First Combination of player 1 & 2
        case "1110":
        case "2220":
          return i + moveChecks[check].indexes[3];

        // Second Combination of player 1 & 2
        case "1101":
        case "2202":
          return i + moveChecks[check].indexes[2];

        // Third Combination of player 1 & 2
        case "1011":
        case "2022":
          return i + moveChecks[check].indexes[1];

        // Fourth Combination of player 1 & 2
        case "0111":
        case "0222":
          return i + moveChecks[check].indexes[0];
        default:
      }
    }
  }
  return -1;
};

export const getComputerMove = (gameBoard) => {
  // Array store all of the possible moves can win
  let moveChecks = [
    // Vertical
    {
      indexes: [0, 4, 8, 12],
      max: 4, // 4 columns to check
      step: 1,
    },

    // Horizontal
    {
      indexes: [0, 1, 2, 3],
      max: 16, // 4 rows to check (16 total cells)
      step: 4,
    },

    // Left Diagnose
    {
      indexes: [0, 5, 10, 15],
      max: 16, // 16 total cells
      step: 16, // Step is 16 because it's only 1 left diagnose => No need to repeat it 4 times
    },

    // Right Diagnose
    {
      indexes: [3, 6, 9, 12],
      max: 16, // 16 total cells
      step: 16, // Step is 16 because it's only 1 right diagnose => No need to repeat it 4 times
    },
  ];

  let position = getPosition(gameBoard, moveChecks);
  if (position > -1) return position;

  return getRandomComputerMove(gameBoard);
};
