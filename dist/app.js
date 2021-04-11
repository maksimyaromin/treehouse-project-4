"use strict";

{
  $(document).ready(function () {
    $("#year").text(new Date().getFullYear());
    var toolbarContext = $(".game-toolbar");
    var gameContext = $(".game-space");
    new Game(toolbarContext, gameContext);
  });
}