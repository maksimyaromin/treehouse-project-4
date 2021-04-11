"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

/* The object with the main game logics accepts input 
    variables DOM of the setting panel and the game context    
*/
var Game = function Game(toolbarContext, gameContext) {
  this.toolbarContext = toolbarContext;
  this.gameContext = gameContext;
  this.players = [];
  this.moves = 0;
  this.raunds = 0;
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
  this["new"]();
};
/* Start a new game
*/


Game.prototype["new"] = function () {
  var _this = this;

  var gameHTML = ui.getNewGameHTML(this.toolbarContext);
  var startButton = gameHTML.find("#startButton");
  startButton.on("click", function () {
    gameHTML.remove();

    _this.start();
  });
};
/* Game settings 
    Player can choose a size of a playing board
    Quantity of players (1 or 2) 
    Set player's name  and color
    and also choose a shape if a user plays with a computer
*/


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
    var color = isSecond ? secondPlayerContext.find("[name=\"secondColor\"]:checked").val() : firstPlayerContext.find("[name=\"firstColor\"]:checked").val();

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
  /* If a player hasn't specified any settings  
      then the game with a computer  on the board 3 on 3 will start. 
      The user's color will be red and the name GoodKat, 
  the color of the computer will be blue, and the name PDP-11
  */

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

    _this2.gameContext.closest(".game").addClass("game-started");
  });
};
/* Apply game settings and start the game
*/


Game.prototype.play = function (player1, player2, gameBoard) {
  var _this3 = this;

  /* Add players
  */
  this.addPlayer(player1);
  this.addPlayer(player2);
  /* Add HTML with scoring panels and counter rounds,
       as well as a menu button
  */

  this.updateRaundsCounter();
  this.updateScoreBoard();
  var menuButton = ui.getGameMenuButtonHTML(this.gameContext);
  menuButton.on("click", function () {
    return _this3.openMenu();
  });
  /* Create a game board
  */

  this.board = gameBoard;
  this.board.create(function (row, column, cell) {
    return _this3.nextMove(row, column, cell);
  });
  /* Prepare for the first move
  */

  this.move();
};
/* Open menu while playing
*/


Game.prototype.openMenu = function () {
  var _this4 = this;

  var gameMenu = ui.getGameMenuHTML(this.toolbarContext);
  this.gameContext.closest(".game").removeClass("game-started");
  this.gameContext.addClass("game_menu-opened");

  var closeMenu = function closeMenu() {
    gameMenu.remove();

    _this4.gameContext.removeClass("game_menu-opened");

    _this4.gameContext.closest(".game").addClass("game-started");
  };

  var continueButton = gameMenu.find("#continueButton");
  continueButton.on("click", function () {
    return closeMenu();
  });
  var resetButton = gameMenu.find("#resetButton");
  resetButton.on("click", function () {
    return _this4.reload(closeMenu);
  });
};
/* Select a current player and take a move if the computer plays
*/


Game.prototype.move = function () {
  var player = this.next;
  this.player = player; // Highlight the name of a current player

  this.scoreBoardContext.find(".game-player").each(function (idndex, element) {
    element = $(element).removeClass("game-player_move-on");

    if (element.is("[data-player=\"".concat(player.id, "\"]"))) {
      element.addClass("game-player_move-on");
    }
  });
  /* View the current shape
  */

  this.board.boardContext.attr("data-shape", player.shape === GAME_SHAPES.X ? "x" : "o");
  /* Computer's move
  */

  if (player.isAI) {
    var _player$calculateMove = player.calculateMove(this.board, this.moves),
        _player$calculateMove2 = _slicedToArray(_player$calculateMove, 2),
        row = _player$calculateMove2[0],
        column = _player$calculateMove2[1];

    var cell = this.board.boardContext.find(".game-cell[data-row=\"".concat(row, "\"][data-column=\"").concat(column, "\"]")).off("click");
    this.nextMove(row, column, cell);
  }
};
/* Make a move (the handler of clicking on the cage or the computer's auto-move)
*/


Game.prototype.nextMove = function (row, column, cell) {
  var _this5 = this;

  var player = this.player;
  this.board.move(player.shape, row, column);
  var shape = player.shape === GAME_SHAPES.X ? "\n            <svg class=\"".concat(player.color, "\">\n                <use xmlns:xlink=\"http://www.w3.org/1999/xlink\" \n                    xlink:href=\"./assets/images/sprite.svg#shapeX\"></use>\n            </svg>\n        ") : "\n            <svg class=\"".concat(player.color, "\">\n                <use xmlns:xlink=\"http://www.w3.org/1999/xlink\" \n                    xlink:href=\"./assets/images/sprite.svg#shapeO\"></use>\n            </svg>\n        ");
  cell.html(shape);
  cell.addClass("game-cell_move-on");
  this.moves++;
  this.updateRaundsCounter();
  /* Check a winner after a sufficient number of moves
  */

  if (this.moves >= 2 * this.board.size - 1) {
    var winner = this.board.check();

    if (winner) {
      this.raunds++;
      var messenge = winner.player === -1 ? "DRAW" : "".concat(player.name, " win");
      this.raundsCounterContext.html("<span>".concat(messenge, "</span>")); // Update the game after 3 seconds

      setTimeout(function () {
        _this5.refresh(winner);
      }, 3000); // stop the game for the winner

      return this.board.stop(winner);
    }
  } // prepare for the next move


  return this.move();
}; // Add a player to the game


Game.prototype.addPlayer = function (player) {
  if (player instanceof Player) {
    this.players.push(player);
  }
}; // Update count panel


Game.prototype.updateScoreBoard = function () {
  if (this.scoreBoardContext) this.scoreBoardContext.remove();
  this.scoreBoardContext = ui.getScoreBoardHTML(this.gameContext, this.players);
}; // Update rounds counter


Game.prototype.updateRaundsCounter = function () {
  if (this.raundsCounterContext) this.raundsCounterContext.remove();
  this.raundsCounterContext = ui.getGameRaundsCounterHTML(this.gameContext, this.raunds + 1, this.moves);
}; // Update the game after the round is over


Game.prototype.refresh = function (winner) {
  var _this6 = this;

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
    return _this6.nextMove(row, column, cell);
  });
  this.moves = 0;
  this.updateRaundsCounter();
  this.move();
}; // Reset the game in menu


Game.prototype.reload = function (closeMenu) {
  var _this7 = this;

  this.players = this.players.map(function (player) {
    player.score = 0;
    player.move = player.shape === GAME_SHAPES.X;
    return player;
  });
  this.raunds = 0;
  this.moves = 0;
  this.updateScoreBoard();
  this.board.refresh(function (row, column, cell) {
    return _this7.nextMove(row, column, cell);
  });
  this.updateRaundsCounter();
  closeMenu();
  this.move();
};