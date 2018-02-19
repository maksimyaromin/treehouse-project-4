
const Player = function (id, name, shape, color, isAI) {
    this.id = id;
    this.name = name;
    this.shape = shape;
    this.move = shape === GAME_SHAPES.X;
    this.color = color;
    this.score = 0;
    this.isAI = isAI;
};
Player.prototype.getRandomIndex = (max, min = 0) => {
    return getRandom(min, max);
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
Player.prototype.incScore = function(score = 1) {
    this.score += score;
};