





{
    $(document).ready(() => {
        $("#year").text((new Date()).getFullYear());
        
        const toolbarContext = $(".game-toolbar");
        const gameContext = $(".game-space");

        const game = new Game(toolbarContext, gameContext);
    });
}