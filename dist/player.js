function _sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _slicedToArray(arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return _sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }

var Player = function Player(id, name, shape, color, isAI) {
  this.id = id;
  this.name = name;
  this.shape = shape;
  this.move = shape === GAME_SHAPES.X;
  this.color = color;
  this.score = 0;
  this.isAI = isAI;
};

Player.prototype.getRandomIndex = function (max) {
  var min = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  return getRandom(min, max);
};

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

Player.prototype.calculateMove = function (gameBoard, moves) {
  if (moves === 0) {
    return [this.getRandomIndex(gameBoard.size - 1), this.getRandomIndex(gameBoard.size - 1)];
  }

  for (var i = 0; i < gameBoard.size; i++) {
    for (var j = 0; j < gameBoard.size; j++) {
      var board = gameBoard.copyBoard();

      if (board[i][j] === -1) {
        board[i][j] = this.shape;
        var myWin = gameBoard.check(board);

        if (myWin) {
          return [i, j];
        }

        board[i][j] = this.shape === GAME_SHAPES.X ? GAME_SHAPES.O : GAME_SHAPES.X;
        var enemyWin = gameBoard.check(board);

        if (enemyWin) {
          return [i, j];
        }
      }
    }
  }

  return this.getMove(gameBoard);
};

Player.prototype.incScore = function () {
  var score = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
  this.score += score;
};