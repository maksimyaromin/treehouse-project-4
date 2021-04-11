"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

/* Object representing the player
    id - random number (in our case 1 or 2)
    name - player name (if specified), 
        GoodKat if other is not specified and PDP-11 if Computer plays
    shape - game figure
    move - does a player make a move (X-shape moves first by default)
    color - color of the player to choose from four
    score - player score
    isAI - computer or player
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
/* Secondary function to obtain a random cell from 0 to the size of the playing board
*/


Player.prototype.getRandomIndex = function (max) {
  var min = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  return getRandom(min, max);
};
/* The recursive function to obtain a free cell for the computer's move
*/


Player.prototype.getMove = function (gameBoard) {
  var row = this.getRandomIndex(gameBoard.size - 1),
      column = this.getRandomIndex(gameBoard.size - 1);

  if (gameBoard.board[row][column] !== -1) {
    var _this$getMove = this.getMove(gameBoard);

    var _this$getMove2 = _slicedToArray(_this$getMove, 2);

    row = _this$getMove2[0];
    column = _this$getMove2[1];
  }

  return [row, column];
};
/* The logic of the computer interface of the game.
    If a computer makes the first move, the figure will be set in a random cell.
    If the computer makes a move that is less than 2 * the size of the field - 2 
	(i.e., if the winning situation could not occur according to the number of moves), 
	then a random non-occupied cell returns.
    If the winning situation could occur, then the computer looks for its prospects 
	for winning and returns the winning cell. If there is no chance of winning, 
	then the computer looks for the opponent's winning cell and tries to stop him.
    If no interesting cells are found, then a random unoccupied cell will return.
*/


Player.prototype.calculateMove = function (gameBoard, moves) {
  if (moves === 0) {
    return [this.getRandomIndex(gameBoard.size - 1), this.getRandomIndex(gameBoard.size - 1)];
  }

  if (moves + 1 < 2 * gameBoard.size - 2) {
    return this.getMove(gameBoard);
  } // Find by win


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
  } // Find opponent's win


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
}; // Enlarge account


Player.prototype.incScore = function () {
  var score = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
  this.score += score;
};