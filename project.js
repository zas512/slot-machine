const prompt = require("prompt-sync")();

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

const deposit = () => {
  while (true) {
    const depositAmount = prompt("Enter a Deposit Amount : ");
    const numDepositAmount = parseFloat(depositAmount);
    if (isNaN(numDepositAmount) || numDepositAmount <= 0) {
      console.log("Invalid Amount, Try Again!");
    } else {
      return numDepositAmount;
    }
  }
};

const getNumOfLines = () => {
  while (true) {
    const lines = prompt("Enter Number of Lines to Bet On : ");
    const numOfLines = parseFloat(lines);
    if (isNaN(numOfLines) || numOfLines <= 0 || numOfLines > 3) {
      console.log("Invalid Number of Lines, Try Again!");
    } else {
      return numOfLines;
    }
  }
};

const getBet = (balance, numOfLines) => {
  while (true) {
    const bet = prompt("Enter The Bet Per Line : ");
    const numBet = parseFloat(bet);
    if (isNaN(numBet) || numBet <= 0 || numBet > balance / numOfLines) {
      console.log("Invalid Bet, Try Again!");
    } else {
      return numBet;
    }
  }
};

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
      const randomIndex = Math.floor(Math.random() * reelSymbols.length);
      const selectedSymbol = reelSymbols[randomIndex];
      reels[i].push(selectedSymbol);
      reelSymbols.splice(randomIndex, 1);
    }
  }
  return reels;
};

const transpose = (reels) => {
  const rows = [];
  for (let i = 0; i < ROWS; i++) {
    rows.push([]);
    for (let j = 0; j < COLS; j++) {
      rows[i].push(reels[j][i]);
    }
  }
  return rows;
};

const printRows = (rows) => {
  for (const row of rows) {
    let rowString = "";
    for (const [i, symbol] of row.entries()) {
      rowString += symbol;
      if (i != row.length - 1) {
        rowString += " | ";
      }
    }
    console.log(rowString);
  }
};

const getWinnings = (rows, bet, lines) => {
  let winnings = 0;
  for (let row = 0; row < lines; row++) {
    const symbols = rows[row];
    let allSAme = true;
    for (const symbol of symbols) {
      if (symbol != symbols[0]) {
        allSAme = false;
        break;
      }
    }
    if (allSAme) {
      winnings = +bet * SYMBOLS_VALUES[symbols[0]];
    }
  }
  return winnings;
};

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
    balance += Number(winnings)
    ;
    console.log("You Won, $" + winnings.toString());
    if (balance <= 0) {
      console.log("You Ran Out of Money!");
      break;
    }
    const playAgain = prompt("Do You Want To Play Again (y/n)? :");
    if (playAgain != "y" && playAgain != "Y") break;
  }
};

game();
