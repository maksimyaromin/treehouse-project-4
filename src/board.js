/* Object representing a playing board
    gameContext - selector to insert a field
    size - field size - can be from 3 to 5
*/
const Board = function(gameContext, size = 3) {
    this.gameContext = gameContext;
    if(size < 3 || size > 5) {
        size = 3;
        console.warn(
            "For more comfortable game, please select the field dimension value from 3 to 5. The board size is automatically set to 3."
        );
    };
    this.size = size;
    this.board = [];
    /* Fill in the field with default values
    */
    this.fill();
};
/* Helper function to copy the current state of the game board   
*/
Board.prototype.copyBoard = function() {
    const board = [];
    for (let i = 0; i < this.board.length; i++) {
        const row = [];
        for (let j = 0; j < this.board[i].length; j++) {
            row.push(this.board[i][j]);
        }
        board.push(row);
    }
    return board;
};
/* Create an html view of the game board and hang up the 
     clicking on the cell handler. Each player can click on only once
*/
Board.prototype.create = function(move) {
    this.boardContext = ui.getGameBoardHTML(this.gameContext, this.size);
    this.boardContext.find(".game-cell").one("click", e => {
        const cell = $(e.target),
            row = cell.data("row"),
            column = cell.data("column");
        move(row, column, cell);
    });
};
/* At the software level, the game board represents a size by size 
    matrix filled with -1 by default. This function fills the 
    matrix with default values.
*/
Board.prototype.fill = function() {
    for (let i = 0; i < this.size; i++) {
        const row = [];
        for (let j = 0; j < this.size; j++) {
            row.push(-1);
        }
        this.board.push(row);
    }
};
/* Victory checking logics
*/
Board.prototype.check = function(board = null) {
    board = board ? board : this.board;
    let result = null, freeCells = 0;
    const lastIndex = this.size - 1;
    for (let i = 0; i < this.size; i++) {
        /* The value in the cross-cage is taken as a check value. 
		    For example, for the board 3 on 3, we will check the values 00, 11, 22 - which is, 
			the diagonal.             
        */
        const x = board[i][i];
        let X = true, Y = true, D = i === 0, Db = i === 0;
        for (let j = 0; j < this.size; j++) {
            /* If the value equals -1, then increase the counter of empty cells
            */
            if(board[i][j] === -1) { freeCells++; }
            /* Check the string with a verification value
            */
            if(x === -1 || board[i][j] !== x) { X = false; }
            /* Check the column with the verification value
            */
            if(x === -1 || board[j][i] !== x) { Y = false; }
            /* On the first step also check the main diagonal
            */
            if(
                D && (x === -1 || board[j][j] !== x)
            ) { D = false; } 
            /* and secondary diagonal
            */
            if(
                Db && (board[lastIndex][0] === -1 || board[lastIndex - j][j] !== board[lastIndex][0])
            ) { Db = false; } 
        }
        /* If checking has brought the result - return the resultant object with win type           
        */
        if(X || Y || D || Db) {
            let type, player = x;
            if(X) {
                type = WIN_TYPES.ROW;
            } else if(Y) {
                type = WIN_TYPES.COLUMN;
            } else if(D) {
                type = WIN_TYPES.MAIN_DIAGONAL;
            } else if(Db) {
                type = WIN_TYPES.DIAGONAL;
                player = board[lastIndex][0];
            }
            result = { player, index: i, type };
            break;
        }
    }
    /* If no more empty cells - then return a draw 
    */
    return result 
        ? result 
        : freeCells ? result : { player: -1 };
};
/* Player makes move
*/
Board.prototype.move = function(shape, row, column) {
    this.board[row][column] = shape;
}
/* Stop the game and mark the winning line
*/
Board.prototype.stop = function(winner) {
    this.boardContext.removeAttr("data-shape");
    if(winner.player === -1) { return; }
    this.boardContext.find(".game-cell").off("click")
        .each((index, cell) => {
            cell = $(cell);
            switch (winner.type) {
                case WIN_TYPES.COLUMN: {
                    if(cell.data("column") === winner.index) {
                        cell.addClass("game-cell_won");
                    }
                    break;
                }
                case WIN_TYPES.ROW: {
                    if(cell.data("row") === winner.index) {
                        cell.addClass("game-cell_won");
                    }
                    break;
                }
                case WIN_TYPES.MAIN_DIAGONAL: {
                    if(cell.data("row") === cell.data("column")) {
                        cell.addClass("game-cell_won");
                    }
                    break;
                }
                case WIN_TYPES.DIAGONAL: {
                    const rowIndex = Math.floor(index / this.size);
                    if(cell.data("row") === rowIndex
                        && cell.data("column") === (this.size - 1 - rowIndex)
                    ) {
                        cell.addClass("game-cell_won");  
                    }
                    break;
                }
            };
        });
};
/* Update playing board 
*/
Board.prototype.refresh = function(move) {
    this.boardContext.remove();
    this.board = [];
    this.fill();
    this.create(move);
};