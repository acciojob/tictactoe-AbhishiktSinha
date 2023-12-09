//your JS code here. If required.
const form = document.querySelector("form");
const boardContainer = document.querySelector(".board-container");

const root = document.querySelector("#root");

let playerID = {};
setPlayerNames();

// form submit event
form.addEventListener("submit", (event) => {
    
    event.preventDefault();
    
    setPlayerNames();
    const mainMenu = form.parentElement;
    mainMenu.classList.add("hide");

    initializePlayerNames();

    form.reset;

    boardContainer.classList.remove("hide");    
})



function setPlayerNames() {
    if (form.p1_Name.value === '') {
        playerID.p1Name = "Player 1";
    }
    else {
        playerID.p1Name = form.p1_Name.value;
    }

    if (form.p2_Name.value === '') {
        playerID.p2Name = "Player 2"
    }
    else {
        playerID.p2Name = form.p2_Name.value;
    }
}
function getPlayerNames() {
    console.info(playerID);
    return playerID;
}

document.querySelector("#new-game-button").addEventListener("click", ()=> {
    location.reload();
})

// ------------------------------------------------------------------

// mark the current playing player?
let turn = 1;

let player1_name;
let player2_name;

let currPlayer;

function initializePlayerNames() {
    console.info("initializing player names");
    player1_name =  getPlayerNames().p1Name;
    player2_name = getPlayerNames().p2Name;

    currPlayer = player1_name;
    updateGameStatus(false);
}


const gameStatus = document.querySelector(".game-status");

function updateGameStatus(gameOver, winner) {
    if (!gameOver) {
        gameStatus.textContent = `${currPlayer}, you're up`;
    }
    else {
        if (winner) {
            gameStatus.textContent = `${winner} congratulations you won!`;
        }
        else {
            gameStatus.textContent = `This game was a draw`;
        }
    }
}

const playerMoves = {
    p1Moves: [],
    p2Moves: []
};

const board = document.querySelector("#board");

board.addEventListener("mouseover", (event) => {
    if (event.target.classList.contains("cell")) {


        if (event.target.textContent != '') {

            console.log("over a filled cell");
            event.target.style.cursor = "not-allowed";
        }
    }
})

board.addEventListener("click", moveMadeByPlayer);

function moveMadeByPlayer(event) {

    if (event.target.classList.contains("cell")) {
        event.stopPropagation();

        const cell = event.target;

        // if move already made at current cell;
        if (cell.textContent != '') {
            return;
        }

        let currPlayerMoves = turn === 1 ? playerMoves.p1Moves : playerMoves.p2Moves;
        let otherPlayerMoves = turn === 1 ? playerMoves.p2Moves : playerMoves.p1Moves;

        // extract the index of cell
        let index = cell.getAttribute("data-row") + cell.getAttribute("data-col");
        console.log(`click at ${index}`);

        // implementing move
        moveAt(cell.id);

        // checking win and registering move
        if (checkVictory(index)) {
            gameOver(true, currPlayer);
        }
        else {
            currPlayerMoves.push(index);

            console.log(currPlayerMoves, otherPlayerMoves);
            // if all avaliable cells have been filled, total moves === 9
            if ((currPlayerMoves.length + otherPlayerMoves.length) === 9) {
                gameOver(false);
            }
            else {
                turn = turn === 1 ? 2 : 1;
                currPlayer = currPlayer === player1_name ? player2_name : player1_name;
                updateGameStatus(false)
            }
        }
    }
}

function moveAt(cellId) {
    document.getElementById(cellId).textContent = turn == 1 ? 'X' : 'O';
}

function checkVictory(index) {

    // get the appropriate player's previous moves
    let previousMoves = turn === 1 ? playerMoves.p1Moves : playerMoves.p2Moves;

    if (previousMoves.length < 2) {
        return false;
    }

    // check for three in a row
    // if two already exist in the current row, and another is added -> victory
    if (previousMoves.filter((element) => { return (element.charAt(0) === index.charAt(0)); }).length == 2) {
        highlight(index.charAt(0));
        return true;
    }

    // check for two in a column
    if (previousMoves.filter((element) => { return (element.charAt(1) === index.charAt(1)) }).length === 2) {
        highlight(undefined, index.charAt(1));
        return true;
    }

    // check for two in a diagonal

    if (checkDiagMoves(previousMoves, index)) {
        return true;
    }

    return false;
}
function checkDiagMoves(previousMoves, index) {
    console.log("checking diagonal");

    // diagonal move is only valid if current move is on a diagonal
    if ((index.charAt(0) === index.charAt(1)) || (index === '02') || index === '20') {


        // find any previous moves which were on the diagonal
        let prevDiagMoves = 0;
        for (let move of previousMoves) {
            if (move.charAt(0) === move.charAt(1) && index.charAt(0) === index.charAt(1)) {
                prevDiagMoves++;
            }
        }

        if (prevDiagMoves === 2) {
            highlight(undefined, undefined, 1);
            return true;
        }
        if((previousMoves.includes('02') && previousMoves.includes('20')) ||
        (previousMoves.includes('11') && previousMoves.includes('20')) ||
        (previousMoves.includes('11') && previousMoves.includes('02'))) {
            highlight(undefined, undefined, 2);
            return true;
        }
    }
    return false;
}

function gameOver(victory, winnerPlayer) {
    if (victory) {
        updateGameStatus(victory, winnerPlayer)
    }
    else {
        updateGameStatus(true);
    }

    // stop further moves
    board.removeEventListener("click", moveMadeByPlayer);
}

function highlight(row, col, diag) {
    let winningMoveCells=[];
    if(row) {
        winningMoveCells = document.querySelectorAll(`.cell[data-row="${row}"]`);
    }
    else if(col) {
        winningMoveCells = document.querySelectorAll(`.cell[data-col="${col}"]`);
    }
    else if(diag === 1) {
        winningMoveCells.push(document.querySelector("#cell-1"));
        winningMoveCells.push(document.querySelector("#cell-5"));
        winningMoveCells.push(document.querySelector("#cell-9"));
    }
    else {
        winningMoveCells.push(document.querySelector("#cell-3"));
        winningMoveCells.push(document.querySelector("#cell-5"));
        winningMoveCells.push(document.querySelector("#cell-7"));
    }

    for(let cell of winningMoveCells) {
        cell.classList.add("winning-move");
    }
}