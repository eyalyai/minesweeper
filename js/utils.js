function renderBoard(board) {
    var strHTML = '<h2 class="winlose"></h2><table border="2"><tbody>'
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>';
        for (var j = 0; j < board[0].length; j++) {
            var value = (!gGame.isOn) ? EMPTY : renderCell(board, i, j);
            var className = `cell cell${i}-${j}`;
            strHTML += `<td onmousedown="FuncOnClick(event,${i},${j})"`
            strHTML += ` class="${className}">${value}</td>`;
        }
        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>';
    var elBoard = document.querySelector('.board');
    elBoard.style.top -= `${42 * (board.length / 2)} + px`;
    elBoard.style.left -= `${42 * (board.length / 2)} + px`;
    elBoard.innerHTML = strHTML;
}

function renderCell(board, i, j) { // return elCell.innerText value
    var cell = board[i][j];
    var elCell = document.querySelector(`.cell${i}-${j}`);
    if (cell.isMine) elCell.style.backgroundColor = 'red';
    else elCell.style.backgroundColor = 'white';
    if (cell.isMine && cell.isShown) return MINE;
    // if (cell.isMarked) return FLAG;
    if (cell.isShown) {
        if (cell.minesAroundCount === 0) return EMPTY;
        else if (cell.minesAroundCount > 0) return cell.minesAroundCount;
    } else return EMPTY;
}


function FuncOnClick(event, i, j) {
    var elCell = document.querySelector(`.cell${i}-${j}`);
    console.log('mouse click ' + event.which);
    switch (event.which) {
        case 1: //left click

            cellClicked(elCell, i, j)
            break;
        case 3: //right click
            cellMarked(elCell, i, j)
            gBoard[i][j].isMarked = true;
            break;
    }
}

function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}