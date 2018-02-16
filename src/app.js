
const ui = {
    buildMenu(context) {
        if(!context) { return; }
        const menuHTML = `
            <ul class="game-toolbar__actions">
                <li class="game-toolbar__action">
                    <button id="startButton" 
                        class="btn btn-primary btn-game">Start Game</button>
                </li>
            </ul>`;
        context.html(menuHTML);
    },
    buildPlayerSwitcher(context) {
        if(!context) { return; }
        const switcherHTML = `
            <div class="game-options">

            </div>`;
        context.html(switcherHTML);
    },
    buildBoard(context, size) {
        if(!context) { return; }
        let boardHTML = `<div class="game-board" data-size=${size}>`;
        for (let idx = 0; idx < size * size; idx++) {
            const rowIndex = Math.floor(idx / size);
            const columnIndex = idx < size
                ? idx
                : idx % size;
            boardHTML += `<span class="game-cell" 
                data-row="${rowIndex}" data-column="${columnIndex}"></span>`;
        }
        boardHTML += "</div>";
        return $(boardHTML).appendTo(context)
            .css({
                "grid-template-columns": `repeat(${size}, 100px)`
            });
    }
};

const GAME_SHAPES = { X: 1, O: 0 };
const WIN_TYPES = {
    ROW: "ROW",
    COLUMN: "COLUMN",
    MAIN_DIAGONAL: "MAIN_DIAGONAL",
    DIAGONAL: "DIAGONAL"
};

const Game = function(toolbarContext, gameContext) {

    this.toolbarContext = toolbarContext;
    this.gameContext = gameContext;
    
    this.players = [];
    this.moves = 0;

    const player1 = new Player("PDP11", GAME_SHAPES.O, null, true);
    const player2 = new Player("GoodKat", GAME_SHAPES.X);

    this.addPlayer(player1);
    this.addPlayer(player2);

    Object.defineProperty(this, "player", {
        get: function() {
            let currentPlayer = null;
            this.players = this.players.map(player => {
                if(player.move) { currentPlayer = player; }
                player.move = !player.move;
                return player;
            });
            return currentPlayer;
        }
    });

    this.board = new Board(gameContext);
    this.board.create((row, column, cell) => this.nextMove(row, column, cell));

    this.currentPlayer = null;
    this.move();
};
Game.prototype.move = function() {
    const player = this.player;
    this.currentPlayer = player;
    if(player.isAI) {
        const [ row, column ] = player.calculateMove(this.board, this.moves);
        const cell = this.board.boardContext.find(
            `.game-cell[data-row="${row}"][data-column="${column}"]`
        ).off("click");
        this.nextMove(row, column, cell);
    }
};
Game.prototype.nextMove = function(row, column, cell) {
    const player = this.currentPlayer;
    this.board.move(player.shape, row, column);
    cell.text(player.shape === GAME_SHAPES.X ? "X" : "O");
    this.moves++;
    
    if(this.moves >= (2 * this.board.size - 1)) {
        const winner = this.board.check();
        if(winner) { return this.board.stop(winner); }
    }
    return this.move();
};
Game.prototype.addPlayer = function(player) {
    if(player instanceof Player) {
        this.players.push(player);
    }
};
Game.prototype.newGame = function() {
    
    ui.buildMenu(this.toolbarContext);
    const startButton = this.toolbarContext.find("#startButton");
    startButton.on("click", e => this.start());

};
Game.prototype.start = function() {

    ui.buildPlayerSwitcher(this.toolbarContext);

};

const Player = function (name, shape, color, isAI) {
    this.name = name;
    this.shape = shape;
    this.move = shape === GAME_SHAPES.X;
    this.isAI = isAI;
};
Player.prototype.getRandomIndex = (max, min = 0) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};
Player.prototype.getMove = function(gameBoard) {
    let row = this.getRandomIndex(gameBoard.size - 1),
        column = this.getRandomIndex(gameBoard.size - 1);
    if(gameBoard.board[row][column] !== -1) {
        [ row, column ] = this.getMove(gameBoard);
    }
    return [ row, column ];
};
Player.prototype.calculateMove = function(gameBoard, moves) {   
    if(moves === 0) {
        return [ 
            this.getRandomIndex(gameBoard.size - 1), this.getRandomIndex(gameBoard.size - 1) 
        ];
    }
    for (let i = 0; i < gameBoard.size; i++) {
        for (let j = 0; j < gameBoard.size; j++) {
            const board = gameBoard.copyBoard();
            if(board[i][j] === -1) {
                board[i][j] = this.shape;
                const myWin = gameBoard.check(board);
                if(myWin) { return [ i, j ]; }
                board[i][j] = this.shape === GAME_SHAPES.X 
                    ? GAME_SHAPES.O 
                    : GAME_SHAPES.X;
                const enemyWin = gameBoard.check(board);
                if(enemyWin) { return [ i, j ]; }
            }
        }
    }
    return this.getMove(gameBoard);
};

const Board = function(gameContext, size = 3) {
    this.gameContext = gameContext;
    if(size < 3 || size > 5) {
        size = 3;
        console.warn(
            "Для наиболее комфортной игры выберите значения размерности поля от 3 до 5. Поле size автоматически установлено в 3."
        );
    };
    this.size = size;
    this.board = [];
    this.fill();
};
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
Board.prototype.create = function(move) {
    this.boardContext = ui.buildBoard(this.gameContext, this.size);
    this.boardContext.find(".game-cell").one("click", e => {
        const cell = $(e.target),
            row = cell.data("row"),
            column = cell.data("column");
        move(row, column, cell);
    });
};
Board.prototype.fill = function() {
    for (let i = 0; i < this.size; i++) {
        const row = [];
        for (let j = 0; j < this.size; j++) {
            row.push(-1);
        }
        this.board.push(row);
    }
};
Board.prototype.check = function(board = null) {
    board = board ? board : this.board;
    let result = null, emptyCellsCount = 0;
    const lastIndex = this.size - 1;
    for (let i = 0; i < this.size; i++) {
        const x = board[i][i];
        let X = true, Y = true, D = i === 0, Db = i === 0;
        for (let j = 0; j < this.size; j++) {
            if(board[i][j] === -1) { emptyCellsCount++; }
            if(board[i][j] === -1 || board[i][j] !== x) { X = false; }
            if(board[i][j] === -1 || board[j][i] !== x) { Y = false; }
            if(i === 0 
                && (board[j][j] === -1
                || board[j][j] !== x)
            ) { D = false; } 
            if(i === 0
                && (board[lastIndex - j][j] === -1
                || board[lastIndex - j][j] !== board[lastIndex][0])
            ) { Db = false; } 
        }
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
    return result ? result : emptyCellsCount ? result : { player: -1 };
};
Board.prototype.move = function(shape, row, column) {
    this.board[row][column] = shape;
}
Board.prototype.stop = function(winner) {
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

{
    $(document).ready(() => {
        const toolbarContext = $(".game-toolbar");
        const gameContext = $(".game-space");

        const game = new Game(toolbarContext, gameContext);
        //game.newGame();
    });
}