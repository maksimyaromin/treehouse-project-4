/* Объект, представляющий игрока
    ид - случайное число (в нашем случае 1 или 2)
    нэйм - имя игрока (если задано), 
        ГудКат если не задано и ПДП-11 если играет компьютер
    шэйп - игровая фигура
    мув - делает ли игрок шаг (по умолчанию первыми ходят крестики)
    колор - цвет игрока на выбор из четырех предложенных
    скор - счет игрока
    исАи - компьютер или игрок
*/
const Player = function (id, name, shape, color, isAI) {
    this.id = id;
    this.name = name;
    this.shape = shape;
    this.move = shape === GAME_SHAPES.X;
    this.color = color;
    this.score = 0;
    this.isAI = isAI;
};
/* Вспомогательная функция для получения случайной клетки от
    0 до размера игрового поля
*/
Player.prototype.getRandomIndex = (max, min = 0) => {
    return getRandom(min, max);
};
/* Рекурсивная функция получения свободной клетки для хода компьютера
*/
Player.prototype.getMove = function(gameBoard) {
    let row = this.getRandomIndex(gameBoard.size - 1),
        column = this.getRandomIndex(gameBoard.size - 1);
    if(gameBoard.board[row][column] !== -1) {
        [ row, column ] = this.getMove(gameBoard);
    }
    return [ row, column ];
};
/* Логика компьютерного интерфейса игры.
    Если компьютер делает первый ход, то он установит фигуру в случайную клетку.
    Если компьютер делает ход, который меньше 2 * размер поля - 2 (т. е. если по количеству ходов 
        не могло произойти победной ситуации), то возвращается случайная не занятая клетка.
    Если победная ситуация могла произойти, то компьютер ищет свои перспективы на победу и возвращает 
        победную клетку. Если шансов на победу нет, то компьютер ищет победную клетку противника
        и пытается ему помешать.
    Если интересных клеток не найдена то вернется случайная незанятая клетка.
*/
Player.prototype.calculateMove = function(gameBoard, moves) {   
    if(moves === 0) {
        return [ 
            this.getRandomIndex(gameBoard.size - 1), this.getRandomIndex(gameBoard.size - 1) 
        ];
    }
    if(moves + 1 < (2 * gameBoard.size - 2)) { return this.getMove(gameBoard); }
    // Найти мою победу
    for (let i = 0; i < gameBoard.size; i++) {
        for (let j = 0; j < gameBoard.size; j++) {
            const board = gameBoard.copyBoard();
            if(board[i][j] === -1) {
                board[i][j] = this.shape;
                const myWin = gameBoard.check(board);
                if(myWin) { return [ i, j ]; }
            }
        }
    }
    // Найти победу врага
    for (let i = 0; i < gameBoard.size; i++) {
        for (let j = 0; j < gameBoard.size; j++) {
            const board = gameBoard.copyBoard();
            if(board[i][j] === -1) {
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
// Увеличить счет
Player.prototype.incScore = function(score = 1) {
    this.score += score;
};