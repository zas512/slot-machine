const prompt = require("prompt-sync")();

// Constants
const ROWS = 3;
const COLS = 3;
const SYMBOLS_COUNT = {
  A: 2,
  B: 4,
  C: 6,
  D: 8,
};
const SYMBOLS_VALUES = {
  A: 5,
  B: 4,
  C: 3,
  D: 2,
};

// Generate random elements
const getRandomElement = (array) => {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array.splice(randomIndex, 1)[0];
};

// Validate user input
const validateNumberInput = (input, minValue, maxValue) => {
  const num = parseFloat(input);
  return !isNaN(num) && num >= minValue && num <= maxValue;
};

// User input
const getInput = (message, validationFunc, ...args) => {
  while (true) {
    const input = prompt(message);
    if (validationFunc(input, ...args)) {
      return parseFloat(input);
    } else {
      console.log("Invalid input, please try again.");
    }
  }
};

// Display slot machine rows
const printRows = (rows) => {
  for (const row of rows) {
    const rowString = row.join(" | ");
    console.log(rowString);
  }
};

// Transpose 2D array
const transpose = (reels) => {
  return reels[0].map((_, colIndex) => reels.map((row) => row[colIndex]));
};

// Game functions

// Deposit amount
const deposit = () => {
  while (true) {
    const depositAmount = getInput(
      "Enter a Deposit Amount: ",
      (input) => parseFloat(input) > 0
    );
    if (!isNaN(depositAmount)) {
      return depositAmount;
    }
    console.log("Invalid amount, please try again.");
  }
};

// Number of lines to bet
const getNumOfLines = () => {
  return getInput(
    "Enter Number of Lines to Bet On: ",
    validateNumberInput,
    1,
    3
  );
};

// Amount to bet
const getBet = (balance, numOfLines) => {
  const maxBet = balance / numOfLines;
  return getInput(
    "Enter The Bet Per Line: ",
    validateNumberInput,
    0.01,
    maxBet
  );
};

// Spin slot machine
const spin = () => {
  const symbols = [];
  for (const [symbol, count] of Object.entries(SYMBOLS_COUNT)) {
    for (let i = 0; i < count; i++) {
      symbols.push(symbol);
    }
  }
  const reels = [];
  for (let i = 0; i < COLS; i++) {
    reels.push([]);
    const reelSymbols = [...symbols];
    for (let j = 0; j < ROWS; j++) {
      const selectedSymbol = getRandomElement(reelSymbols);
      reels[i].push(selectedSymbol);
    }
  }
  return reels;
};

// Winnings
const getWinnings = (rows, bet, lines) => {
  let winnings = 0;
  for (let row = 0; row < lines; row++) {
    const symbols = rows[row];
    if (symbols.every((symbol) => symbol === symbols[0])) {
      winnings += bet * SYMBOLS_VALUES[symbols[0]];
    }
  }
  return winnings;
};

// Play again prompt
const playAgain = () => {
  const input = prompt("Do You Want To Play Again (y/n)? :");
  return input.toLowerCase() === "y";
};

// Main game loop
const game = () => {
  let balance = deposit();
  while (true) {
    console.log("You Have a Balance of $" + balance);
    const numOfLines = getNumOfLines();
    const bet = getBet(balance, numOfLines);
    balance -= bet * numOfLines;
    const reels = spin();
    const rows = transpose(reels);
    printRows(rows);
    const winnings = getWinnings(rows, bet, numOfLines);
    balance += winnings;
    console.log("You Won: $" + winnings);
    if (balance <= 0) {
      console.log("You Ran Out of Money!");
      break;
    }
    if (!playAgain()) {
      break;
    }
  }
};

game();
