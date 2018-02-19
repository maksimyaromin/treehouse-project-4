{
  $(document).ready(function () {
    $("#year").text(new Date().getFullYear());
    var toolbarContext = $(".game-toolbar");
    var gameContext = $(".game-space");
    var game = new Game(toolbarContext, gameContext);
  });
}