function _sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _slicedToArray(arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return _sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }

var Game = function Game(toolbarContext, gameContext) {
  this.toolbarContext = toolbarContext;
  this.gameContext = gameContext;
  this.players = [];
  this.moves = 0;
  Object.defineProperty(this, "next", {
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
  this.new();
};

Game.prototype.new = function () {
  var _this = this;

  var gameHTML = ui.getNewGameHTML(this.toolbarContext);
  var startButton = gameHTML.find("#startButton");
  startButton.on("click", function () {
    gameHTML.remove();

    _this.start();
  });
};

Game.prototype.start = function () {
  var _this2 = this;

  var gameOptionsHTML = ui.getGameOptionsHTML(this.toolbarContext);
  var playerCountSwitch = gameOptionsHTML.find("#playersCount");
  var firstPlayerContext = gameOptionsHTML.find(".first-player-options");
  var gameShapeSwitchContext = firstPlayerContext.find(".game-shape-container");
  var secondPlayerContext = gameOptionsHTML.find(".second-player-options");
  var firstColorPicker = firstPlayerContext.find("[name=\"firstColor\"]");
  var secondColorPicker = secondPlayerContext.find("[name=\"secondColor\"]");

  var changeColor = function changeColor(isTwoPlayers) {
    var isSecond = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    var color = isSecond ? secondPlayerContext.find("[name=\"secondColor\"]:checked").val() : firstPlayerColor = firstPlayerContext.find("[name=\"firstColor\"]:checked").val();

    if (color) {
      isSecond ? secondPlayerContext.attr("data-player-color", color) : firstPlayerContext.attr("data-player-color", color);
    }

    if (!isTwoPlayers) {
      secondColorPicker.prop("checked", false).prop("disabled", false);
      firstColorPicker.prop("disabled", false);
      return;
    }

    isSecond ? firstColorPicker.each(function (idx, element) {
      element = $(element);
      element.prop("value") === color ? element.prop("disabled", true) : element.prop("disabled", false);
    }) : secondColorPicker.each(function (idx, element) {
      element = $(element);
      element.prop("value") === color ? element.prop("disabled", true) : element.prop("disabled", false);
    });
  };

  firstColorPicker.on("change", function () {
    var isTwoPlayers = playerCountSwitch.is(":checked");
    changeColor(playerCountSwitch.is(":checked"));
  });
  secondColorPicker.on("change", function () {
    var isTwoPlayers = playerCountSwitch.is(":checked");
    changeColor(playerCountSwitch.is(":checked"), true);
  });

  var togglePlayersCount = function togglePlayersCount(element) {
    var isTwoPlayers = element.is(":checked");

    if (isTwoPlayers) {
      firstPlayerContext.show();
      secondPlayerContext.show();
      gameShapeSwitchContext.hide();
    } else {
      firstPlayerContext.show();
      secondPlayerContext.hide();
      gameShapeSwitchContext.show();
    }

    changeColor(isTwoPlayers);
    gameOptionsHTML.find("[data-active-placeholder=\"true\"]").each(function (idx, element) {
      activePlaceholder($(element));
    });
  };

  playerCountSwitch.on("change", function (e) {
    return togglePlayersCount($(e.target));
  });
  togglePlayersCount(playerCountSwitch);
  var btnPlay = gameOptionsHTML.find("#btnPlay");
  btnPlay.on("click", function (e) {
    e.preventDefault();
    var boardSize = gameOptionsHTML.find("[name=\"boardSize\"]").val() || 3;
    var isTwo = playerCountSwitch.is(":checked");
    var firstColor = gameOptionsHTML.find("[name=\"firstColor\"]:checked").val();
    var secondColor = gameOptionsHTML.find("[name=\"secondColor\"]:checked").val();
    var firstPlayerName = gameOptionsHTML.find("[name=\"firstName\"]").val() || "GoodKat";
    var firstPlayerShape = !isTwo && gameOptionsHTML.find("[name=\"firstShape\"]:checked").val() === "0" ? GAME_SHAPES.O : getRandom(0, 200) % 2 === 0 ? GAME_SHAPES.X : GAME_SHAPES.O;
    ;
    var firstPlayerColor = firstColor ? firstColor : secondColor === "red" ? "blue" : "red";
    var secondPlayerName = isTwo ? gameOptionsHTML.find("[name=\"secondName\"]").val() || "Max" : "PDP-11";
    var secondPlayerShape = firstPlayerShape === GAME_SHAPES.X ? GAME_SHAPES.O : GAME_SHAPES.X;
    var secondPlayerColor = secondColor ? secondColor : firstColor === "blue" ? "red" : "blue";
    var secondPlayerIsAI = !isTwo;
    var player1 = new Player(1, firstPlayerName, firstPlayerShape, firstPlayerColor, false);
    var player2 = new Player(2, secondPlayerName, secondPlayerShape, secondPlayerColor, secondPlayerIsAI);
    var gameBoard = new Board(_this2.gameContext, boardSize);

    _this2.play(player1, player2, gameBoard);

    gameOptionsHTML.remove();
  });
};

Game.prototype.play = function (player1, player2, gameBoard) {
  var _this3 = this;

  this.addPlayer(player1);
  this.addPlayer(player2);
  this.updateScoreBoard();
  this.board = gameBoard;
  this.board.create(function (row, column, cell) {
    return _this3.nextMove(row, column, cell);
  });
  this.move();
};

Game.prototype.move = function () {
  var player = this.next;
  this.player = player;
  this.board.boardContext.attr("data-shape", player.shape === GAME_SHAPES.X ? "x" : "o");

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
  var _this4 = this;

  var player = this.player;
  this.board.move(player.shape, row, column);
  var shape = player.shape === GAME_SHAPES.X ? "\n            <svg class=\"".concat(player.color, "\">\n                <use xmlns:xlink=\"http://www.w3.org/1999/xlink\" \n                    xlink:href=\"./assets/images/sprite.svg#shapeX\"></use>\n            </svg>\n        ") : "\n            <svg class=\"".concat(player.color, "\">\n                <use xmlns:xlink=\"http://www.w3.org/1999/xlink\" \n                    xlink:href=\"./assets/images/sprite.svg#shapeO\"></use>\n            </svg>\n        ");
  cell.html(shape);
  cell.addClass("game-cell_move-on");
  this.moves++;

  if (this.moves >= 2 * this.board.size - 1) {
    var winner = this.board.check();

    if (winner) {
      setTimeout(function () {
        _this4.refresh(winner);
      }, 3000);
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

Game.prototype.updateScoreBoard = function () {
  if (this.scoreBoardContext) this.scoreBoardContext.remove();
  this.scoreBoardContext = ui.getScoreBoardHTML(this.gameContext, this.players);
};

Game.prototype.refresh = function (winner) {
  var _this5 = this;

  this.players = this.players.map(function (player) {
    if (player.shape === winner.player) {
      player.incScore(1);
    }

    player.shape = player.shape === GAME_SHAPES.X ? GAME_SHAPES.O : GAME_SHAPES.X;
    player.move = player.shape === GAME_SHAPES.X;
    return player;
  });
  this.updateScoreBoard();
  this.board.refresh(function (row, column, cell) {
    return _this5.nextMove(row, column, cell);
  });
  this.moves = 0;
  this.move();
};