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
      var rowIndex = idx < size ? 0 : Math.floor(idx / size);
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
  var player1 = new Player("Max", GAME_SHAPES.O);
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
  this.board.create(function (e) {
    var player = _this.player;
    var cell = $(e.target),
        row = cell.data("row"),
        column = cell.data("column");

    _this.board.move(player.shape, row, column);

    $(e.target).text(player.shape === GAME_SHAPES.X ? "X" : "O");
    _this.moves++;

    if (_this.moves >= 2 * _this.board.size - 1) {
      var winner = _this.board.check();

      if (winner) {
        _this.board.stop(winner);
      }
    }
  });
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
};

var Board = function Board(gameContext) {
  var size = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 3;
  this.gameContext = gameContext;

  if (size < 2 || size > 5) {
    size = 3;
    console.warn("Для наиболее комфортной игры выберите значения размерности поля от 2 до 5. Поле size автоматически установлено в 3.");
  }

  ;
  this.size = size;
  this.board = [];
  this.fill();
};

Board.prototype.create = function (move) {
  this.boardContext = ui.buildBoard(this.gameContext, this.size);
  this.boardContext.find(".game-cell").one("click", function (e) {
    return move(e);
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
  var result = null;
  var lastIndex = this.size - 1;

  for (var i = 0; i < this.size; i++) {
    var x = this.board[i][i];

    if (x === -1) {
      continue;
    }

    var X = true,
        Y = true,
        D = i === 0,
        Db = i === 0;

    for (var j = 0; j < this.size; j++) {
      if (this.board[i][j] !== x) {
        X = false;
      }

      if (this.board[j][i] !== x) {
        Y = false;
      }

      if (i === 0 && this.board[j][j] !== x) {
        D = false;
      }

      if (i === 0 && this.board[lastIndex - j][j] !== this.board[lastIndex][0]) {
        Db = false;
      }
    }

    if (X || Y || D || Db) {
      var type = void 0;
      var player = x;

      if (X) {
        type = WIN_TYPES.ROW;
      } else if (Y) {
        type = WIN_TYPES.COLUMN;
      } else if (D) {
        type = WIN_TYPES.MAIN_DIAGONAL;
      } else if (Db) {
        type = WIN_TYPES.DIAGONAL;
        player = this.board[lastIndex][0];
      }

      result = {
        player: player,
        index: i,
        type: type
      };
      break;
    }
  }

  return result;
};

Board.prototype.move = function (shape, row, column) {
  this.board[row][column] = shape;
};

Board.prototype.stop = function (winner) {
  this.boardContext.find(".game-cell").off("click");
  console.log(winner);
  this.boardContext.find(".game-cell").each(function (index, cell) {
    cell = $(cell);

    switch (winner.type) {
      case WIN_TYPES.COLUMN:
        {
          if (cell.data("column") === winner.index) {
            $(cell).addClass("game-cell_won");
          }

          break;
        }

      case WIN_TYPES.ROW:
        {
          if (cell.data("row") === winner.index) {
            $(cell).addClass("game-cell_won");
          }

          break;
        }

      case WIN_TYPES.MAIN_DIAGONAL:
        {
          if (cell.data("row") === cell.data("column")) {
            $(cell).addClass("game-cell_won");
          }

          break;
        }

      case WIN_TYPES.DIAGONAL:
        {
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