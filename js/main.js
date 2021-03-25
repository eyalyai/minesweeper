'use strict'

const MINE = '💣';
const EMPTY = ' ';
const FLAG = '🚩';
const HAPPY = '😃';
const DEAD = '💀';
const COOL = '😎';

var gBoard;
var gCell;
var gInterval;
var gLives = 2;
var gGameOver = false;
var gLevel = { SIZE: 4, MINES: 2 }; // lvl1: 1n, lvl2: 2n 8, lvl3: 3n 16
var gGame = {
    isOn: false, // turn on when game start
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
};

function initGame() {
    gBoard = buildBoard(gLevel.SIZE);
    renderBoard(gBoard);
    setSmiley(1);
    renderLives(gLives);
}

function buildBoard(boardSize) {
    var board = [];
    for (var i = 0; i < boardSize; i++) {
        board.push([]);
        for (var j = 0; j < boardSize; j++) {
            board[i][j] = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false
            }
        }
    }
    return board;
}

function createMines(board) {
    var i = 0;
    while (i < gLevel.MINES) {
        var randNum = {
            i: getRandomIntInclusive(0, (board.length) - 1),
            j: getRandomIntInclusive(0, (board.length) - 1)
        }
        var cell = board[randNum.i][randNum.j];
        if (!cell.isShown && !cell.isMine) {
            cell.isMine = true;
            i++;
        }
    }
}

function setMinesNegsCount(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            var pos = { i: i, j: j };
            var cell = board[i][j];

            if (cell.isMine) {
                for (var iNeg = pos.i - 1; iNeg <= pos.i + 1; iNeg++) {
                    if (iNeg < 0 || iNeg >= board.length) continue
                    for (var jNeg = pos.j - 1; jNeg <= pos.j + 1; jNeg++) {
                        if (jNeg < 0 || jNeg >= board[0].length) continue
                        if (iNeg === pos.i && jNeg === pos.j) continue
                        board[iNeg][jNeg].minesAroundCount++;
                    }
                }
            }
        }
    }
}

function gameOn(elCell, i, j) {
    gGame.isOn = true;
    gGame.shownCount++;
    createMines(gBoard);
    setMinesNegsCount(gBoard);
    renderBoard(gBoard);
    timeCounter();
    elCell.innerText = renderCell(gBoard, i, j);
    expandShown(gBoard, i, j);
}


function cellClicked(elCell, i, j) {
    if (gGameOver === true) {
        return;
    }
    if (gBoard[i][j].isMine) {
        gLives--;
        renderLives(gLives)
        gBoard[i][j].isShown = true;
        elCell.innerText = renderCell(gBoard, i, j);
        checkGameOver(i, j);
        return;
    }
    if (gBoard[i][j].isShown) return;
    gBoard[i][j].isShown = true;
    checkGameOver(i, j);
    if (!gGame.isOn) {
        gameOn(elCell, i, j);
        return; //first click.
    }
    gGame.shownCount++;
    elCell.innerText = renderCell(gBoard, i, j);
    expandShown(gBoard, i, j);
}

function cellMarked(elCell, i, j) {
    if (gGameOver === true) return;
    if (gBoard[i][j].isShown) return;
    if (gBoard[i][j].isMarked) {
        gBoard[i][j].isMarked = false;
        elCell.innerText = EMPTY;
        return;
    }
    checkGameOver(i, j);
    gBoard.isMarked = true;
    gGame.markedCount++;
    elCell.innerText = FLAG;
}

function checkGameOver(i, j) {
    var elH1 = document.querySelector('.winlose');
    if (gLives === 0) {
        elH1.innerText = 'you lost\n try again';
        setSmiley(2);
        clearInterval(gInterval)
        gGameOver = true;
        gGame.isOn = false;
        console.log('loop');

    }
    if ((gBoard.length ** 2) - gLevel.MINES === (gGame.shownCount)) {
        elH1.innerText = 'you won!!\n try a a harder level';
        setSmiley(3);
        clearInterval(gInterval);
        gGameOver = true;
        gGame.isOn = false;
    }

}

function expandShown(board, i, j) {
    var pos = { i: i, j: j };
    for (var i = pos.i - 1; i <= pos.i + 1; i++) {
        if (i < 0 || i >= board.length) continue;
        for (var j = pos.j - 1; j <= pos.j + 1; j++) {
            // console.log('gBoard[' + i + '][' + j + ']', '\ncountaround: ' + gBoard[i][j].minesAroundCount);
            if (j < 0 || j >= board[0].length) continue;
            if (board[i][j].isShown) continue;
            if (board[i][j].isMine) return;
            if (board[i][j].isMarked) continue;
            var elCell = document.querySelector(`.cell${i}-${j}`);

            if (board[i][j].minesAroundCount > 0) {
                board[i][j].isShown = true;
                gGame.shownCount++;
                elCell.innerText = renderCell(board, i, j);
            }

            if (board[i][j].minesAroundCount === 0 && !board[i][j].isMine) {
                board[i][j].isShown = true;
                gGame.shownCount++;
                elCell.innerText = renderCell(board, i, j);
                expandShown(board, i, j);
            }
        }
    }
}

function timeCounter() {
    var startTime = Date.now();
    gInterval = setInterval(startTimer, 100);

    function startTimer() {
        var elapsedTime = Date.now() - startTime;
        var elTime = document.querySelector('.time');
        elTime.innerText = 'Time passed: ' + (elapsedTime / 1000).toFixed(1);
    }
}

function changeLvl(lvl) { // button
    gLevel.SIZE = 4 * lvl;
    gLevel.MINES = 2 * lvl;
    if (lvl === 1) gLives = 2;
    if (lvl === 2) gLives = 3;
    if (lvl === 3) gLives = 3;
    initGame()
    gGameOver = false;
    gGame.isOn = false;
}

function setSmiley(statusNum) {
    var smiley;
    switch (statusNum) {
        case 1:
            smiley = HAPPY;
            break;
        case 2:
            smiley = DEAD;
            break;
        case 3:
            smiley = COOL;
            break;
    }
    var elSmiley = document.querySelector('.smiley')
    elSmiley.innerText = smiley;
}

function renderLives(lives) {
    var elLives = document.querySelector('.lives');
    elLives.innerText = 'Lives: ' + lives;
}