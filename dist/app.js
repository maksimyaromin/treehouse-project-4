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

    var switcherHTML = "\n            <ul class=\"game-toolbar__actions\">\n                <li class=\"game-toolbar__action\">\n                    <button id=\"onePlayer\" \n                        class=\"btn btn-primary btn-game\">One Player</button>\n                    \n                </li>\n                <li class=\"game-toolbar__action\">\n                    <button id=\"twoPlayers\" \n                        class=\"btn btn-primary btn-game\">Two Players</button>\n                </li>\n            </ul>";
    context.html(switcherHTML);
  }
};

var Game = function Game(toolbarContext, gameContext) {
  this.toolbarContext = toolbarContext;
  this.gameContext = gameContext;
};

Game.prototype.newGame = function () {
  var _this = this;

  ui.buildMenu(this.toolbarContext);
  var startButton = this.toolbarContext.find("#startButton");
  startButton.on("click", function (e) {
    return _this.start();
  });
};

Game.prototype.start = function () {
  ui.buildPlayerSwitcher(this.toolbarContext);
};

{
  $(document).ready(function () {
    var toolbarContext = $(".game-toolbar");
    var gameContext = $(".game-space");
    var game = new Game(toolbarContext, gameContext);
    game.newGame();
  });
}