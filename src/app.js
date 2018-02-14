
const ui = {
    buildMenu(context) {
        if(!context) { return; }
        const menuHTML = `
            <ul class="game-toolbar__actions">
                <li class="game-toolbar__action">
                    <button id="startButton" 
                        class="btn btn-primary btn-game">Start Game</button>
                </li>
            </ul>`;
        context.html(menuHTML);
    },
    buildPlayerSwitcher(context) {
        if(!context) { return; }
        const switcherHTML = `
            <ul class="game-toolbar__actions">
                <li class="game-toolbar__action">
                    <button id="onePlayer" 
                        class="btn btn-primary btn-game">One Player</button>
                    
                </li>
                <li class="game-toolbar__action">
                    <button id="twoPlayers" 
                        class="btn btn-primary btn-game">Two Players</button>
                </li>
            </ul>`;
        context.html(switcherHTML);
    }
};

const Game = function(toolbarContext, gameContext) {

    this.toolbarContext = toolbarContext;
    this.gameContext = gameContext;

};
Game.prototype.newGame = function() {
    
    ui.buildMenu(this.toolbarContext);
    const startButton = this.toolbarContext.find("#startButton");
    startButton.on("click", e => this.start());

};
Game.prototype.start = function() {

    ui.buildPlayerSwitcher(this.toolbarContext);

};

{
    $(document).ready(() => {
        const toolbarContext = $(".game-toolbar");
        const gameContext = $(".game-space");

        const game = new Game(toolbarContext, gameContext);
        game.newGame();
    });
}