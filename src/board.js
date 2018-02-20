/* Объект, представляющий игровое поле
    гэймКонтекст - селектор для вставки поля
    сайз - размер поля - может быть от 3 до 5
*/
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
    /* Заполнить поле значениями по-умолчанию
    */
    this.fill();
};
/* Вспомогательная функция для копирования текущего состояния
    игрового поля
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
/* Создать хтмл представление игрового поля и повесить обработчик
    нажатия на клетку. На каждую клетку человек может нажать только один раз
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
/* На программном уровне игровое поле представялет собой матрицу
    сайз на сайз, заполненную по умолчанию -1. Эта функция заполняет матрицу
    значениями по умолчанию.
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
/* Логика проверки победы
*/
Board.prototype.check = function(board = null) {
    board = board ? board : this.board;
    let result = null, freeCells = 0;
    const lastIndex = this.size - 1;
    for (let i = 0; i < this.size; i++) {
        /* За проверочное значение выбирается значение в перекресной клетке
            Например для поля 3 на 3 мы будем проверять значения 00, 11, 22 - т. е. диагональ
        */
        const x = board[i][i];
        let X = true, Y = true, D = i === 0, Db = i === 0;
        for (let j = 0; j < this.size; j++) {
            /* Если значение -1, то увеличить счетчик пустых клеток
            */
            if(board[i][j] === -1) { freeCells++; }
            /* Проверить строку с проверочным значением
            */
            if(x === -1 || board[i][j] !== x) { X = false; }
            /* Проверить столбец с проверочным значением
            */
            if(x === -1 || board[j][i] !== x) { Y = false; }
            /* На первом шаге так же проверяем главную диагональ
            */
            if(
                D && (x === -1 || board[j][j] !== x)
            ) { D = false; } 
            /* и побочную диагональ
            */
            if(
                Db && (board[lastIndex][0] === -1 || board[lastIndex - j][j] !== board[lastIndex][0])
            ) { Db = false; } 
        }
        /* Если проверка принесла результат - вовзращаем результативный объект с типом
            победы
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
    /* Если пустые клетки заканчиваются - то вренуть ничью
    */
    return result 
        ? result 
        : freeCells ? result : { player: -1 };
};
/* Игрок сделал ход
*/
Board.prototype.move = function(shape, row, column) {
    this.board[row][column] = shape;
}
/* Остановить игру и отметить победную линию
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
/* Обновить игровое поле
*/
Board.prototype.refresh = function(move) {
    this.boardContext.remove();
    this.board = [];
    this.fill();
    this.create(move);
};