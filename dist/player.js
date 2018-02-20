function _sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _slicedToArray(arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return _sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }

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
var Player = function Player(id, name, shape, color, isAI) {
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


Player.prototype.getRandomIndex = function (max) {
  var min = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  return getRandom(min, max);
};
/* Рекурсивная функция получения свободной клетки для хода компьютера
*/


Player.prototype.getMove = function (gameBoard) {
  var row = this.getRandomIndex(gameBoard.size - 1),
      column = this.getRandomIndex(gameBoard.size - 1);

  if (gameBoard.board[row][column] !== -1) {
    var _getMove = this.getMove(gameBoard);

    var _getMove2 = _slicedToArray(_getMove, 2);

    row = _getMove2[0];
    column = _getMove2[1];
  }

  return [row, column];
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


Player.prototype.calculateMove = function (gameBoard, moves) {
  if (moves === 0) {
    return [this.getRandomIndex(gameBoard.size - 1), this.getRandomIndex(gameBoard.size - 1)];
  }

  if (moves + 1 < 2 * gameBoard.size - 2) {
    return this.getMove(gameBoard);
  } // Найти мою победу


  for (var i = 0; i < gameBoard.size; i++) {
    for (var j = 0; j < gameBoard.size; j++) {
      var board = gameBoard.copyBoard();

      if (board[i][j] === -1) {
        board[i][j] = this.shape;
        var myWin = gameBoard.check(board);

        if (myWin) {
          return [i, j];
        }
      }
    }
  } // Найти победу врага


  for (var _i2 = 0; _i2 < gameBoard.size; _i2++) {
    for (var _j = 0; _j < gameBoard.size; _j++) {
      var _board = gameBoard.copyBoard();

      if (_board[_i2][_j] === -1) {
        _board[_i2][_j] = this.shape === GAME_SHAPES.X ? GAME_SHAPES.O : GAME_SHAPES.X;
        var enemyWin = gameBoard.check(_board);

        if (enemyWin) {
          return [_i2, _j];
        }
      }
    }
  }

  return this.getMove(gameBoard);
}; // Увеличить счет


Player.prototype.incScore = function () {
  var score = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
  this.score += score;
};