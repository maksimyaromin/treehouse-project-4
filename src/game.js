/* The object with the main game logics accepts input 
    variables DOM of the setting panel and the game context    
*/
const Game = function(toolbarContext, gameContext) {
    this.toolbarContext = toolbarContext;
    this.gameContext = gameContext;

    this.players = [];
    this.moves = 0;
    this.raunds = 0;

    Object.defineProperty(this, "next", {
        get: function() {
            let currentPlayer = null;
            this.players = this.players.map(player => {
                if(player.move) { currentPlayer = player; }
                player.move = !player.move;
                return player;
            });
            return currentPlayer;
        }
    });

    this.new();
};
/* Start a new game
*/
Game.prototype.new = function() {
    const gameHTML = ui.getNewGameHTML(
        this.toolbarContext
    );
    const startButton = gameHTML.find("#startButton");

    startButton.on("click", () => {
        gameHTML.remove();
        this.start();
    });
};
/* Game settings 
    Player can choose a size of a playing board
    Quantity of players (1 or 2) 
    Set player's name  and color
    and also choose a shape if a user plays with a computer
*/
Game.prototype.start = function() {
    const gameOptionsHTML = ui.getGameOptionsHTML(
        this.toolbarContext
    );
    const playerCountSwitch = gameOptionsHTML.find("#playersCount");
    const firstPlayerContext = gameOptionsHTML.find(".first-player-options");
    const gameShapeSwitchContext = firstPlayerContext.find(".game-shape-container");
    const secondPlayerContext = gameOptionsHTML.find(".second-player-options");
    const firstColorPicker = firstPlayerContext.find(`[name="firstColor"]`);
    const secondColorPicker = secondPlayerContext.find(`[name="secondColor"]`);

    const changeColor = (isTwoPlayers, isSecond = false) => {
        const color = isSecond
            ? secondPlayerContext.find(`[name="secondColor"]:checked`).val()
            : firstPlayerContext.find(`[name="firstColor"]:checked`).val();

        if(color) {
            isSecond
                ? secondPlayerContext.attr("data-player-color", color)
                : firstPlayerContext.attr("data-player-color", color);
        }

        if(!isTwoPlayers) {
            secondColorPicker
                .prop("checked", false)
                .prop("disabled", false);
            firstColorPicker
                .prop("disabled", false);
            return;
        }

        isSecond
            ? firstColorPicker.each((idx, element) => {
                element = $(element);
                element.prop("value") === color
                    ? element.prop("disabled", true)
                    : element.prop("disabled", false);
            })
            : secondColorPicker.each((idx, element) => {
                element = $(element);
                element.prop("value") === color
                    ? element.prop("disabled", true)
                    : element.prop("disabled", false);
            });
    };
    firstColorPicker.on("change", () => {
        const isTwoPlayers = playerCountSwitch.is(":checked");
        changeColor(playerCountSwitch.is(":checked"));
    });
    secondColorPicker.on("change", () => {
        const isTwoPlayers = playerCountSwitch.is(":checked");
        changeColor(playerCountSwitch.is(":checked"), true);
    });

    const togglePlayersCount = (element) => {
        const isTwoPlayers = element.is(":checked");
        if(isTwoPlayers) {
            firstPlayerContext.show();
            secondPlayerContext.show();
            gameShapeSwitchContext.hide();
        } else {
            firstPlayerContext.show();
            secondPlayerContext.hide();
            gameShapeSwitchContext.show();
        }
        changeColor(isTwoPlayers);
        gameOptionsHTML.find(`[data-active-placeholder="true"]`).each((idx, element) => {
            activePlaceholder($(element));
        });
    };
    playerCountSwitch.on("change", e => togglePlayersCount($(e.target)));
    togglePlayersCount(playerCountSwitch);

    /* If a player hasn't specified any settings  
        then the game with a computer  on the board 3 on 3 will start. 
        The user's color will be red and the name GoodKat, 
		the color of the computer will be blue, and the name PDP-11
    */
    const btnPlay = gameOptionsHTML.find("#btnPlay");
    btnPlay.on("click", e => {
        e.preventDefault();
        
        const boardSize = gameOptionsHTML.find(`[name="boardSize"]`).val() || 3;
        const isTwo = playerCountSwitch.is(":checked");
        const firstColor = gameOptionsHTML.find(`[name="firstColor"]:checked`).val();
        const secondColor = gameOptionsHTML.find(`[name="secondColor"]:checked`).val();

        const firstPlayerName = gameOptionsHTML.find(`[name="firstName"]`).val() || "GoodKat";
        const firstPlayerShape = !isTwo && gameOptionsHTML.find(`[name="firstShape"]:checked`).val() === "0"
            ? GAME_SHAPES.O
            : getRandom(0, 200) % 2 === 0 
                ? GAME_SHAPES.X 
                : GAME_SHAPES.O;;
        const firstPlayerColor = firstColor
            ? firstColor
            : secondColor === "red" ? "blue" : "red";

        const secondPlayerName = isTwo
            ? gameOptionsHTML.find(`[name="secondName"]`).val() || "Max"
            : "PDP-11";
        const secondPlayerShape = firstPlayerShape === GAME_SHAPES.X 
            ? GAME_SHAPES.O 
            : GAME_SHAPES.X;
        const secondPlayerColor = secondColor
            ? secondColor
            : firstColor === "blue" ? "red" : "blue";
        const secondPlayerIsAI = !isTwo;

        const player1 = new Player(
            1,
            firstPlayerName, 
            firstPlayerShape, 
            firstPlayerColor, 
            false
        );
        const player2 = new Player(
            2,
            secondPlayerName, 
            secondPlayerShape, 
            secondPlayerColor, 
            secondPlayerIsAI
        );
        const gameBoard = new Board(this.gameContext, boardSize);
        this.play(player1, player2, gameBoard);
        gameOptionsHTML.remove();

        this.gameContext.closest(".game").addClass("game-started");
    });
};
/* Apply game settings and start the game
*/
Game.prototype.play = function(player1, player2, gameBoard) {
    /* Add players
    */
    this.addPlayer(player1);
    this.addPlayer(player2);

    /* Add HTML with scoring panels and counter rounds,
         as well as a menu button
    */
    this.updateRaundsCounter();
    this.updateScoreBoard();
    const menuButton = ui.getGameMenuButtonHTML(this.gameContext);
    menuButton.on("click", () => this.openMenu());

    /* Create a game board
    */
    this.board = gameBoard;
    this.board.create((row, column, cell) => this.nextMove(row, column, cell));
    /* Prepare for the first move
    */
    this.move();
};
/* Open menu while playing
*/
Game.prototype.openMenu = function() {
    const gameMenu = ui.getGameMenuHTML(this.toolbarContext);
    this.gameContext.closest(".game").removeClass("game-started");
    this.gameContext.addClass("game_menu-opened");

    const closeMenu = () => {
        gameMenu.remove();
        this.gameContext.removeClass("game_menu-opened");
        this.gameContext.closest(".game").addClass("game-started");
    };

    const continueButton = gameMenu.find("#continueButton");
    continueButton.on("click", () => closeMenu());

    const resetButton = gameMenu.find("#resetButton");
    resetButton.on("click", () => this.reload(closeMenu));
};
/* Select a current player and take a move if the computer plays
*/
Game.prototype.move = function() {
    const player = this.next;
    this.player = player;
    // Highlight the name of a current player
    this.scoreBoardContext.find(`.game-player`).each((idndex, element) => {
        element = $(element).removeClass("game-player_move-on");
        if(element.is(`[data-player="${player.id}"]`)) {
            element.addClass("game-player_move-on");
        }
    });
    /* View the current shape
    */
    this.board.boardContext
        .attr("data-shape", player.shape === GAME_SHAPES.X ? "x" : "o");
    /* Computer's move
    */
    if(player.isAI) {
        const [ row, column ] = player.calculateMove(this.board, this.moves);
        const cell = this.board.boardContext.find(
            `.game-cell[data-row="${row}"][data-column="${column}"]`
        ).off("click");
        this.nextMove(row, column, cell);
    }
};
/* Make a move (the handler of clicking on the cage or the computer's auto-move)
*/
Game.prototype.nextMove = function(row, column, cell) {
    const player = this.player;
    this.board.move(player.shape, row, column);
    const shape = player.shape === GAME_SHAPES.X
        ? `
            <svg class="${player.color}">
                <use xmlns:xlink="http://www.w3.org/1999/xlink" 
                    xlink:href="./assets/images/sprite.svg#shapeX"></use>
            </svg>
        `
        : `
            <svg class="${player.color}">
                <use xmlns:xlink="http://www.w3.org/1999/xlink" 
                    xlink:href="./assets/images/sprite.svg#shapeO"></use>
            </svg>
        `;

    cell.html(shape);
    cell.addClass("game-cell_move-on");
    this.moves++;
    this.updateRaundsCounter();

    /* Check a winner after a sufficient number of moves
    */
    if(this.moves >= (2 * this.board.size - 1)) {
        const winner = this.board.check();
        if(winner) { 
            this.raunds++;
            const messenge = winner.player === -1
                ? "DRAW"
                : `${player.name} win`;
            this.raundsCounterContext.html(`<span>${messenge}</span>`);
            // Update the game after 3 seconds
            setTimeout(() => {
               this.refresh(winner);
            }, 3000);
            // stop the game for the winner
            return this.board.stop(winner); 
        }
    }
    // prepare for the next move
    return this.move();
};
// Add a player to the game
Game.prototype.addPlayer = function(player) {
    if(player instanceof Player) {
        this.players.push(player);
    }
};
// Update count panel
Game.prototype.updateScoreBoard = function() {
    if(this.scoreBoardContext) this.scoreBoardContext.remove();
    this.scoreBoardContext = ui.getScoreBoardHTML(this.gameContext, this.players);
};
// Update rounds counter
Game.prototype.updateRaundsCounter = function() {
    if(this.raundsCounterContext) this.raundsCounterContext.remove();
    this.raundsCounterContext = ui.getGameRaundsCounterHTML(this.gameContext, this.raunds + 1, this.moves);
};
// Update the game after the round is over
Game.prototype.refresh = function(winner) {
    this.players = this.players.map(player => {
        if(player.shape === winner.player) {
            player.incScore(1);
        }
        player.shape = player.shape === GAME_SHAPES.X 
            ? GAME_SHAPES.O 
            : GAME_SHAPES.X;
        player.move = player.shape === GAME_SHAPES.X;
        return player;
    });
    this.updateScoreBoard();
    this.board.refresh(
        (row, column, cell) => this.nextMove(row, column, cell)
    );
    this.moves = 0;
    this.updateRaundsCounter();
    this.move();
};
// Reset the game in menu
Game.prototype.reload = function(closeMenu) {
    this.players = this.players.map(player => {
        player.score = 0;
        player.move = player.shape === GAME_SHAPES.X;
        return player;
    })
    this.raunds = 0;
    this.moves = 0;
    this.updateScoreBoard();
    this.board.refresh(
        (row, column, cell) => this.nextMove(row, column, cell)
    );
    this.updateRaundsCounter();
    closeMenu();
    this.move();
};