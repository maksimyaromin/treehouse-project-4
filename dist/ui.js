/* Helper to obtain an active placeholder
*/
var activePlaceholder = function activePlaceholder(element) {
  var action = function action() {
    if (element.val()) {
      element.addClass("form__input_fill");
    } else {
      element.removeClass("form__input_fill");
    }
  };

  element.on("blur", action).addClass("active");
};
/* Secondary object for constructing a graphic part of the game interface 
*/


var ui = {
  /* HTML buttons of game start
  */
  getNewGameHTML: function getNewGameHTML(context) {
    if (!context) {
      return;
    }

    var newGameHTML = "\n            <header class=\"game-header\">\n                <span>Welcome to Game</span>\n            </header>\n            <ul class=\"game-toolbar__actions\">\n                <li class=\"game-toolbar__action\">\n                    <button id=\"startButton\" \n                        class=\"btn btn-primary btn-game\">Start Game</button>\n                </li>\n            </ul>";
    return $(newGameHTML).prependTo(context);
  },

  /* HTML forms with game settings
  */
  getGameOptionsHTML: function getGameOptionsHTML(context) {
    if (!context) {
      return;
    }

    var gameOptionsHTML = "\n            <header class=\"game-header\">\n                <span>Setup your Game</span>\n            </header>\n            <div class=\"game-options\">\n                <form class=\"form\">\n                    <fieldset class=\"form__group\">\n                        <legend class=\"form__group-legend\">Basic Settings</legend>\n\n                        <div class=\"form__control-container\">\n                            <div class=\"form__control form__control_select\">\n                                <select id=\"boardSize\" name=\"boardSize\" class=\"form__input form__input_select\">\n                                    <option value=\"\" selected disabled hidden>Choose size of game board</option>\n                                    <option value=\"3\">3</option>\n                                    <option value=\"4\">4</option>\n                                    <option value=\"5\">5</option>\n                                </select>\n                                <span class=\"active-placeholder\">Board Size</span>\n                            </div>\n                        </div>\n\n                        <div class=\"form__control-container\">\n                            <div class=\"form__control form__control_switch\">\n                                <input class=\"form__switch\" type=\"checkbox\" id=\"playersCount\" name=\"playersCount\" />\n                                <label class=\"form__switch-label\" for=\"playersCount\" data-unckecked-marker=\"1\" data-checked-marker=\"2\">\n                                    Players\n                                </label>\n                            </div>\n                        </div>\n\n                    </fieldset>\n\n                    <fieldset class=\"form__group first-player-options\" style=\"display: none;\">\n                        <legend class=\"form__group-legend\">1st Player</legend>\n\n                        <div class=\"form__control-container\">\n                            <div class=\"form__control\">\n                                <input type=\"text\" name=\"firstName\" id=\"firstName\" class=\"form__input\" data-active-placeholder=\"true\" />\n                                <span class=\"active-placeholder\">Player Name</span>\n                            </div>\n                        </div>\n\n                        <div class=\"form__control-container game-shape-container\" style=\"display: none;\">\n                            <div class=\"game-options-label\">\n                                <span>Choose your shape</span>\n                            </div>\n                            <div class=\"form__control_radio game-shape\">\n                                <div class=\"radio-inline\">\n                                    <input class=\"form__radio\" id=\"shapeX\" name=\"firstShape\" type=\"radio\" value=\"1\" />\n                                    <label class=\"form__radio-label game-shape-item\" for=\"shapeX\">\n                                        <svg>\n                                            <use xmlns:xlink=\"http://www.w3.org/1999/xlink\" \n                                                xlink:href=\"./assets/images/sprite.svg#shapeX\"></use>\n                                        </svg>\n                                    </label>    \n                                </div>\n                                <div class=\"radio-inline\">\n                                    <input class=\"form__radio\" id=\"shapeO\" name=\"firstShape\" type=\"radio\" value=\"0\" />\n                                    <label class=\"form__radio-label game-shape-item\" for=\"shapeO\">\n                                        <svg>\n                                            <use xmlns:xlink=\"http://www.w3.org/1999/xlink\" \n                                                xlink:href=\"./assets/images/sprite.svg#shapeO\"></use>\n                                        </svg>\n                                    </label>    \n                                </div>\n                            </div>\n                        </div>\n\n                        <div class=\"form__control-container\">\n                            <div class=\"game-options-label\">\n                                <span>Choose your color</span>\n                            </div>\n                            <div class=\"form__control_radio game-player-color\">\n                                <div class=\"radio-inline\">\n                                    <input class=\"form__radio\" id=\"fColorRed\" name=\"firstColor\" type=\"radio\" value=\"red\" />\n                                    <label class=\"form__radio-label game-player-color-item game-player-color-item_red\" for=\"fColorRed\"></label>    \n                                </div>\n                                <div class=\"radio-inline\">\n                                    <input class=\"form__radio\" id=\"fColorGreen\" name=\"firstColor\" type=\"radio\" value=\"green\" />\n                                    <label class=\"form__radio-label game-player-color-item game-player-color-item_green\" for=\"fColorGreen\"></label>    \n                                </div>\n                                <div class=\"radio-inline\">\n                                    <input class=\"form__radio\" id=\"fColorBlue\" name=\"firstColor\" type=\"radio\" value=\"blue\" />\n                                    <label class=\"form__radio-label game-player-color-item game-player-color-item_blue\" for=\"fColorBlue\"></label>    \n                                </div>\n                                <div class=\"radio-inline\">\n                                    <input class=\"form__radio\" id=\"fColorYellow\" name=\"firstColor\" type=\"radio\" value=\"yellow\" />\n                                    <label class=\"form__radio-label game-player-color-item game-player-color-item_yellow\" for=\"fColorYellow\"></label>    \n                                </div>\n                            </div>\n                        </div>\n\n                    </fieldset>\n\n                    <fieldset class=\"form__group second-player-options\" style=\"display: none;\">\n                        <legend class=\"form__group-legend\">2nd Player</legend>\n\n                        <div class=\"form__control-container\">\n                            <div class=\"form__control\">\n                                <input type=\"text\" name=\"secondName\" id=\"secondName\" class=\"form__input\" data-active-placeholder=\"true\" />\n                                <span class=\"active-placeholder\">Player Name</span>\n                            </div>\n                        </div>\n\n                        <div class=\"form__control-container\">\n                            <div class=\"game-options-label\">\n                                <span>Choose your color</span>\n                            </div>\n                            <div class=\"form__control_radio game-player-color\">\n                                <div class=\"radio-inline\">\n                                    <input class=\"form__radio\" id=\"sColorRed\" name=\"secondColor\" type=\"radio\" value=\"red\" />\n                                    <label class=\"form__radio-label game-player-color-item game-player-color-item_red\" for=\"sColorRed\"></label>    \n                                </div>\n                                <div class=\"radio-inline\">\n                                    <input class=\"form__radio\" id=\"sColorGreen\" name=\"secondColor\" type=\"radio\" value=\"green\" />\n                                    <label class=\"form__radio-label game-player-color-item game-player-color-item_green\" for=\"sColorGreen\"></label>    \n                                </div>\n                                <div class=\"radio-inline\">\n                                    <input class=\"form__radio\" id=\"sColorBlue\" name=\"secondColor\" type=\"radio\" value=\"blue\" />\n                                    <label class=\"form__radio-label game-player-color-item game-player-color-item_blue\" for=\"sColorBlue\"></label>    \n                                </div>\n                                <div class=\"radio-inline\">\n                                    <input class=\"form__radio\" id=\"sColorYellow\" name=\"secondColor\" type=\"radio\" value=\"yellow\" />\n                                    <label class=\"form__radio-label game-player-color-item game-player-color-item_yellow\" for=\"sColorYellow\"></label>    \n                                </div>\n                            </div>\n                        </div>\n\n                    </fieldset>\n\n                    <div class=\"form-actions\">\n                        <button type=\"submit\" class=\"btn btn-primary btn-game\" id=\"btnPlay\">Let's Play</button>\n                    </div>\n                </form>\n            </div>";
    return $(gameOptionsHTML).prependTo(context);
  },

  /* HTML with game board 
  */
  getGameBoardHTML: function getGameBoardHTML(context, size) {
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
  },

  /* HTML with score panel 
  */
  getScoreBoardHTML: function getScoreBoardHTML(context, players) {
    if (!context || players.length !== 2) {
      return;
    }

    var scoreBoardHTML = "<section class=\"game-scoreboard\">";
    players.forEach(function (player) {
      var isX = player.shape === GAME_SHAPES.X;
      scoreBoardHTML += "\n                <div class=\"game-player game-player-".concat(isX ? "x" : "o", "\" data-player=\"").concat(player.id, "\">\n                    <div class=\"game-player-shape\">\n                        <svg class=\"").concat(player.color, "\">\n                            <use xmlns:xlink=\"http://www.w3.org/1999/xlink\" \n                                xlink:href=\"./assets/images/sprite.svg#").concat(isX ? "shapeX" : "shapeO", "\"></use>\n                        </svg>\n                    </div>\n                    <div class=\"game-player-name\">\n                        <span>").concat(player.name, "</span>\n                    </div>\n                    <div class=\"game-player-score\">\n                        <span>").concat(player.score, "</span>\n                    </div>\n                </div>");
    });
    scoreBoardHTML += "</section>";
    return $(scoreBoardHTML).prependTo(context);
  },

  /* HTML for round counting/moves in a round
  */
  getGameRaundsCounterHTML: function getGameRaundsCounterHTML(context, raunds, moves) {
    if (!context) {
      return;
    }

    var gameRaundsCounterHTML = "\n            <div class=\"game-raunds-counter\">\n                <span>".concat(raunds, " / ").concat(moves, "</span>\n            </div>");
    return $(gameRaundsCounterHTML).prependTo(context);
  },

  /* Button for calling the game menu
  */
  getGameMenuButtonHTML: function getGameMenuButtonHTML(context) {
    if (!context) {
      return;
    }

    var gameMenuBottonHTML = "<div class=\"game-menu-button\" id=\"openMenu\"></div>";
    return $(gameMenuBottonHTML).prependTo(context);
  },

  /* Game menu 
  */
  getGameMenuHTML: function getGameMenuHTML(context) {
    if (!context) {
      return;
    }

    var gameMenuHTML = "\n            <header class=\"game-header\">\n                <span>Pause in Game</span>\n            </header>\n            <ul class=\"game-toolbar__actions\">\n                <li class=\"game-toolbar__action\">\n                    <button id=\"continueButton\" \n                        class=\"btn btn-primary btn-game\">Continue Game</button>\n                </li>\n                <li class=\"game-toolbar__action\">\n                    <button id=\"resetButton\" \n                        class=\"btn btn-primary btn-game\">Reset Game</button>\n                </li>\n            </ul>";
    return $(gameMenuHTML).prependTo(context);
  }
};