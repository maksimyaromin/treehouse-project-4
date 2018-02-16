function _sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _slicedToArray(arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return _sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }

var ui = {
  buildMenu: function buildMenu(context) {
    if (!context) {
      return;
    }

    var menuHTML = "\n            <ul class=\"game-toolbar__actions\">\n                <li class=\"game-toolbar__action\">\n                    <button id=\"startButton\" \n                        class=\"btn btn-primary btn-game\">Start Game</button>\n                </li>\n            </ul>";
    context.html(menuHTML);
  },
  buildPlayerSwitcher: function buildPlayerSwitcher(context) {
    if (!context) {
      return;
    }

    var switcherHTML = "\n            <div class=\"game-options\">\n\n            </div>";
    context.html(switcherHTML);
  },
  buildBoard: function buildBoard(context, size) {
    if (!context) {
      return;
    }

    var boardHTML = "<div class=\"game-board\" data-size=".concat(size, ">");

    for (var idx = 0; idx < size * size; idx++) {
      var rowIndex = Math.floor(idx / size);
      var columnIndex = idx < size ? idx : idx % size;
      boardHTML += "<span class=\"game-cell\" \n                data-row=\"".concat(rowIndex, "\" data-column=\"").concat(columnIndex, "\"></span>");
    }

    boardHTML += "</div>";
    return $(boardHTML).appendTo(context).css({
      "grid-template-columns": "repeat(".concat(size, ", 100px)")
    });
  }
};
var GAME_SHAPES = {
  X: 1,
  O: 0
};
var WIN_TYPES = {
  ROW: "ROW",
  COLUMN: "COLUMN",
  MAIN_DIAGONAL: "MAIN_DIAGONAL",
  DIAGONAL: "DIAGONAL"
};

var Game = function Game(toolbarContext, gameContext) {
  var _this = this;

  this.toolbarContext = toolbarContext;
  this.gameContext = gameContext;
  this.players = [];
  this.moves = 0;
  var player1 = new Player("PDP11", GAME_SHAPES.O, null, true);
  var player2 = new Player("GoodKat", GAME_SHAPES.X);
  this.addPlayer(player1);
  this.addPlayer(player2);
  Object.defineProperty(this, "player", {
    get: function get() {
      var currentPlayer = null;
      this.players = this.players.map(function (player) {
        if (player.move) {
          currentPlayer = player;
        }

        player.move = !player.move;
        return player;
      });
      return currentPlayer;
    }
  });
  this.board = new Board(gameContext);
  this.board.create(function (row, column, cell) {
    return _this.nextMove(row, column, cell);
  });
  this.currentPlayer = null;
  this.move();
};

Game.prototype.move = function () {
  var player = this.player;
  this.currentPlayer = player;

  if (player.isAI) {
    var _player$calculateMove = player.calculateMove(this.board, this.moves),
        _player$calculateMove2 = _slicedToArray(_player$calculateMove, 2),
        row = _player$calculateMove2[0],
        column = _player$calculateMove2[1];

    var cell = this.board.boardContext.find(".game-cell[data-row=\"".concat(row, "\"][data-column=\"").concat(column, "\"]")).off("click");
    this.nextMove(row, column, cell);
  }
};

Game.prototype.nextMove = function (row, column, cell) {
  var player = this.currentPlayer;
  this.board.move(player.shape, row, column);
  cell.text(player.shape === GAME_SHAPES.X ? "X" : "O");
  this.moves++;

  if (this.moves >= 2 * this.board.size - 1) {
    var winner = this.board.check();

    if (winner) {
      return this.board.stop(winner);
    }
  }

  return this.move();
};

Game.prototype.addPlayer = function (player) {
  if (player instanceof Player) {
    this.players.push(player);
  }
};

Game.prototype.newGame = function () {
  var _this2 = this;

  ui.buildMenu(this.toolbarContext);
  var startButton = this.toolbarContext.find("#startButton");
  startButton.on("click", function (e) {
    return _this2.start();
  });
};

Game.prototype.start = function () {
  ui.buildPlayerSwitcher(this.toolbarContext);
};

var Player = function Player(name, shape, color, isAI) {
  this.name = name;
  this.shape = shape;
  this.move = shape === GAME_SHAPES.X;
  this.isAI = isAI;
};

Player.prototype.getRandomIndex = function (max) {
  var min = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  return Math.floor(Math.random() * (max - min + 1)) + min;
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

var Board = function Board(gameContext) {
  var size = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 3;
  this.gameContext = gameContext;

  if (size < 3 || size > 5) {
    size = 3;
    console.warn("Для наиболее комфортной игры выберите значения размерности поля от 3 до 5. Поле size автоматически установлено в 3.");
  }

  ;
  this.size = size;
  this.board = [];
  this.fill();
};

Board.prototype.copyBoard = function () {
  var board = [];

  for (var i = 0; i < this.board.length; i++) {
    var row = [];

    for (var j = 0; j < this.board[i].length; j++) {
      row.push(this.board[i][j]);
    }

    board.push(row);
  }

  return board;
};

Board.prototype.create = function (move) {
  this.boardContext = ui.buildBoard(this.gameContext, this.size);
  this.boardContext.find(".game-cell").one("click", function (e) {
    var cell = $(e.target),
        row = cell.data("row"),
        column = cell.data("column");
    move(row, column, cell);
  });
};

Board.prototype.fill = function () {
  for (var i = 0; i < this.size; i++) {
    var row = [];

    for (var j = 0; j < this.size; j++) {
      row.push(-1);
    }

    this.board.push(row);
  }
};

Board.prototype.check = function () {
  var board = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  board = board ? board : this.board;
  var result = null,
      emptyCellsCount = 0;
  var lastIndex = this.size - 1;

  for (var i = 0; i < this.size; i++) {
    var x = board[i][i];
    var X = true,
        Y = true,
        D = i === 0,
        Db = i === 0;

    for (var j = 0; j < this.size; j++) {
      if (board[i][j] === -1) {
        emptyCellsCount++;
      }

      if (board[i][j] === -1 || board[i][j] !== x) {
        X = false;
      }

      if (board[i][j] === -1 || board[j][i] !== x) {
        Y = false;
      }

      if (i === 0 && (board[j][j] === -1 || board[j][j] !== x)) {
        D = false;
      }

      if (i === 0 && (board[lastIndex - j][j] === -1 || board[lastIndex - j][j] !== board[lastIndex][0])) {
        Db = false;
      }
    }

    if (X || Y || D || Db) {
      var type = void 0,
          player = x;

      if (X) {
        type = WIN_TYPES.ROW;
      } else if (Y) {
        type = WIN_TYPES.COLUMN;
      } else if (D) {
        type = WIN_TYPES.MAIN_DIAGONAL;
      } else if (Db) {
        type = WIN_TYPES.DIAGONAL;
        player = board[lastIndex][0];
      }

      result = {
        player: player,
        index: i,
        type: type
      };
      break;
    }
  }

  return result ? result : emptyCellsCount ? result : {
    player: -1
  };
};

Board.prototype.move = function (shape, row, column) {
  this.board[row][column] = shape;
};

Board.prototype.stop = function (winner) {
  var _this3 = this;

  if (winner.player === -1) {
    return;
  }

  this.boardContext.find(".game-cell").off("click").each(function (index, cell) {
    cell = $(cell);

    switch (winner.type) {
      case WIN_TYPES.COLUMN:
        {
          if (cell.data("column") === winner.index) {
            cell.addClass("game-cell_won");
          }

          break;
        }

      case WIN_TYPES.ROW:
        {
          if (cell.data("row") === winner.index) {
            cell.addClass("game-cell_won");
          }

          break;
        }

      case WIN_TYPES.MAIN_DIAGONAL:
        {
          if (cell.data("row") === cell.data("column")) {
            cell.addClass("game-cell_won");
          }

          break;
        }

      case WIN_TYPES.DIAGONAL:
        {
          var rowIndex = Math.floor(index / _this3.size);

          if (cell.data("row") === rowIndex && cell.data("column") === _this3.size - 1 - rowIndex) {
            cell.addClass("game-cell_won");
          }

          break;
        }
    }

    ;
  });
};

{
  $(document).ready(function () {
    var toolbarContext = $(".game-toolbar");
    var gameContext = $(".game-space");
    var game = new Game(toolbarContext, gameContext); //game.newGame();
  });
}