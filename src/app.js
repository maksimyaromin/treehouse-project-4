
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
            const rowIndex = idx < size
                ? 0
                : Math.floor(idx / size);
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

    const player1 = new Player("Max", GAME_SHAPES.O);
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

    this.board.create((e) => {
        const player = this.player;
        const cell = $(e.target),
            row = cell.data("row"),
            column = cell.data("column");
        this.board.move(player.shape, row, column);
        $(e.target).text(player.shape === GAME_SHAPES.X ? "X" : "O");
        this.moves++;
        
        if(this.moves >= (2 * this.board.size - 1)) {
            const winner = this.board.check();
            if(winner) {
                this.board.stop(winner);
            }
        }
    });
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
};

const Board = function(gameContext, size = 3) {

    this.gameContext = gameContext;
    if(size < 2 || size > 5) {
        size = 3;
        console.warn(
            "Для наиболее комфортной игры выберите значения размерности поля от 2 до 5. Поле size автоматически установлено в 3."
        );
    };
    this.size = size;
    this.board = [];
   
    this.fill();

};
Board.prototype.create = function(move) {
    this.boardContext = ui.buildBoard(this.gameContext, this.size);
    this.boardContext.find(".game-cell").one("click", e => move(e));
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
Board.prototype.check = function() {
    let result = null;
    const lastIndex = this.size - 1;
    for (let i = 0; i < this.size; i++) {
        const x = this.board[i][i];
        if(x === -1) { continue; }
        let X = true, Y = true, D = i === 0, Db = i === 0;
        for (let j = 0; j < this.size; j++) {
            if(this.board[i][j] !== x) { X = false; }
            if(this.board[j][i] !== x) { Y = false; }
            if(i === 0 && this.board[j][j] !== x) { D = false; } 
            if(i === 0
                && this.board[lastIndex - j][j] !== this.board[lastIndex][0]
            ) { Db = false; } 
        }
        if(X || Y || D || Db) {
            let type;
            let player = x;
            if(X) {
                type = WIN_TYPES.ROW;
            } else if(Y) {
                type = WIN_TYPES.COLUMN;
            } else if(D) {
                type = WIN_TYPES.MAIN_DIAGONAL;
            } else if(Db) {
                type = WIN_TYPES.DIAGONAL;
                player = this.board[lastIndex][0];
            }
            result = { 
                player,
                index: i, 
                type
            };
            break;
        }
    }
    return result;
};
Board.prototype.move = function(shape, row, column) {
    this.board[row][column] = shape;
}
Board.prototype.stop = function(winner) {
    this.boardContext.find(".game-cell").off("click");

    console.log(winner);
    this.boardContext.find(".game-cell").each((index, cell) => {
        cell = $(cell);
        switch (winner.type) {
            case WIN_TYPES.COLUMN: {
                if(cell.data("column") === winner.index) {
                    $(cell).addClass("game-cell_won");
                }
                break;
            }
            case WIN_TYPES.ROW: {
                if(cell.data("row") === winner.index) {
                    $(cell).addClass("game-cell_won");
                }
                break;
            }
            case WIN_TYPES.MAIN_DIAGONAL: {
                if(cell.data("row") === cell.data("column")) {
                    $(cell).addClass("game-cell_won");
                }
                break;
            }
            case WIN_TYPES.DIAGONAL: {
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