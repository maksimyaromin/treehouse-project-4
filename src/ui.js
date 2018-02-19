const activePlaceholder = (element) => {
    const action = () => {
        if(element.val()) {
            element.addClass("form__input_fill");
        } else {
            element.removeClass("form__input_fill");
        }
    };
    element.on("blur", action).addClass("active");
};

const ui = {
    getNewGameHTML(context) {
        if(!context) { return; }
        const newGameHTML = `
            <header class="game-header">
                <span>Welcome to Game</span>
            </header>
            <ul class="game-toolbar__actions">
                <li class="game-toolbar__action">
                    <button id="startButton" 
                        class="btn btn-primary btn-game">Start Game</button>
                </li>
            </ul>`;
        return $(newGameHTML).prependTo(context);
    },
    getGameOptionsHTML(context) {
        if(!context) { return; }
        const gameOptionsHTML = `
            <header class="game-header">
                <span>Setup your Game</span>
            </header>
            <div class="game-options">
                <form class="form">
                    <fieldset class="form__group">
                        <legend class="form__group-legend">Basic Settings</legend>

                        <div class="form__control-container">
                            <div class="form__control form__control_select">
                                <select id="boardSize" name="boardSize" class="form__input form__input_select">
                                    <option value="" selected disabled hidden>Choose size of game board</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                </select>
                                <span class="active-placeholder">Board Size</span>
                            </div>
                        </div>

                        <div class="form__control-container">
                            <div class="form__control form__control_switch">
                                <input class="form__switch" type="checkbox" id="playersCount" name="playersCount" />
                                <label class="form__switch-label" for="playersCount" data-unckecked-marker="1" data-checked-marker="2">
                                    Players
                                </label>
                            </div>
                        </div>

                    </fieldset>

                    <fieldset class="form__group first-player-options" style="display: none;">
                        <legend class="form__group-legend">1st Player</legend>

                        <div class="form__control-container">
                            <div class="form__control">
                                <input type="text" name="firstName" id="firstName" class="form__input" data-active-placeholder="true" />
                                <span class="active-placeholder">Player Name</span>
                            </div>
                        </div>

                        <div class="form__control-container game-shape-container" style="display: none;">
                            <div class="game-options-label">
                                <span>Choose your shape</span>
                            </div>
                            <div class="form__control_radio game-shape">
                                <div class="radio-inline">
                                    <input class="form__radio" id="shapeX" name="firstShape" type="radio" value="1" />
                                    <label class="form__radio-label game-shape-item" for="shapeX">
                                        <svg>
                                            <use xmlns:xlink="http://www.w3.org/1999/xlink" 
                                                xlink:href="./assets/images/sprite.svg#shapeX"></use>
                                        </svg>
                                    </label>    
                                </div>
                                <div class="radio-inline">
                                    <input class="form__radio" id="shapeO" name="firstShape" type="radio" value="0" />
                                    <label class="form__radio-label game-shape-item" for="shapeO">
                                        <svg>
                                            <use xmlns:xlink="http://www.w3.org/1999/xlink" 
                                                xlink:href="./assets/images/sprite.svg#shapeO"></use>
                                        </svg>
                                    </label>    
                                </div>
                            </div>
                        </div>

                        <div class="form__control-container">
                            <div class="game-options-label">
                                <span>Choose your color</span>
                            </div>
                            <div class="form__control_radio game-player-color">
                                <div class="radio-inline">
                                    <input class="form__radio" id="fColorRed" name="firstColor" type="radio" value="red" />
                                    <label class="form__radio-label game-player-color-item game-player-color-item_red" for="fColorRed"></label>    
                                </div>
                                <div class="radio-inline">
                                    <input class="form__radio" id="fColorGreen" name="firstColor" type="radio" value="green" />
                                    <label class="form__radio-label game-player-color-item game-player-color-item_green" for="fColorGreen"></label>    
                                </div>
                                <div class="radio-inline">
                                    <input class="form__radio" id="fColorBlue" name="firstColor" type="radio" value="blue" />
                                    <label class="form__radio-label game-player-color-item game-player-color-item_blue" for="fColorBlue"></label>    
                                </div>
                                <div class="radio-inline">
                                    <input class="form__radio" id="fColorYellow" name="firstColor" type="radio" value="yellow" />
                                    <label class="form__radio-label game-player-color-item game-player-color-item_yellow" for="fColorYellow"></label>    
                                </div>
                            </div>
                        </div>

                    </fieldset>

                    <fieldset class="form__group second-player-options" style="display: none;">
                        <legend class="form__group-legend">2nd Player</legend>

                        <div class="form__control-container">
                            <div class="form__control">
                                <input type="text" name="secondName" id="secondName" class="form__input" data-active-placeholder="true" />
                                <span class="active-placeholder">Player Name</span>
                            </div>
                        </div>

                        <div class="form__control-container">
                            <div class="game-options-label">
                                <span>Choose your color</span>
                            </div>
                            <div class="form__control_radio game-player-color">
                                <div class="radio-inline">
                                    <input class="form__radio" id="sColorRed" name="secondColor" type="radio" value="red" />
                                    <label class="form__radio-label game-player-color-item game-player-color-item_red" for="sColorRed"></label>    
                                </div>
                                <div class="radio-inline">
                                    <input class="form__radio" id="sColorGreen" name="secondColor" type="radio" value="green" />
                                    <label class="form__radio-label game-player-color-item game-player-color-item_green" for="sColorGreen"></label>    
                                </div>
                                <div class="radio-inline">
                                    <input class="form__radio" id="sColorBlue" name="secondColor" type="radio" value="blue" />
                                    <label class="form__radio-label game-player-color-item game-player-color-item_blue" for="sColorBlue"></label>    
                                </div>
                                <div class="radio-inline">
                                    <input class="form__radio" id="sColorYellow" name="secondColor" type="radio" value="yellow" />
                                    <label class="form__radio-label game-player-color-item game-player-color-item_yellow" for="sColorYellow"></label>    
                                </div>
                            </div>
                        </div>

                    </fieldset>

                    <div class="form-actions">
                        <button type="submit" class="btn btn-primary btn-game" id="btnPlay">Let's Play</button>
                    </div>
                </form>
            </div>`;
        return $(gameOptionsHTML).prependTo(context);
    },
    getGameBoardHTML(context, size) {
        if(!context) { return; }
        let boardHTML = `<div class="game-board" data-size=${size}>`;
        for (let idx = 0; idx < size * size; idx++) {
            const rowIndex = Math.floor(idx / size);
            const columnIndex = idx < size
                ? idx
                : idx % size;
            boardHTML += `<span class="game-cell" 
                data-row="${rowIndex}" data-column="${columnIndex}"></span>`;
        }
        boardHTML += "</div>";
        return $(boardHTML).appendTo(context)
            .css({
                "grid-template-columns": `repeat(${size}, 100px)`
            });
    },
    getScoreBoardHTML(context, players) {
        if(!context || players.length !== 2) { return; }
        let scoreBoardHTML = `<section class="game-scoreboard">`;
        players.forEach(player => {
            const isX = player.shape === GAME_SHAPES.X;
            scoreBoardHTML += `
                <div class="game-player game-player-${isX ? "x" : "o"}" data-player="${player.id}">
                    <div class="game-player-shape">
                        <svg class="${player.color}">
                            <use xmlns:xlink="http://www.w3.org/1999/xlink" 
                                xlink:href="./assets/images/sprite.svg#${isX ? "shapeX" : "shapeO"}"></use>
                        </svg>
                    </div>
                    <div class="game-player-name">
                        <span>${player.name}</span>
                    </div>
                    <div class="game-player-score">
                        <span>${player.score}</span>
                    </div>
                </div>`;
        });
        scoreBoardHTML += "</section>";
        return $(scoreBoardHTML).prependTo(context);
    },
    getGameRaundsCounterHTML(context, raunds, moves) {
        if(!context) { return; }
        const gameRaundsCounterHTML = `
            <div class="game-raunds-counter">
                <span>${raunds} / ${moves}</span>
            </div>`;
        return $(gameRaundsCounterHTML).prependTo(context);
    },
    getGameMenuButtonHTML(context) {
        if(!context) { return; }
        const gameMenuBottonHTML = `<div class="game-menu-button" id="openMenu"></div>`;
        return $(gameMenuBottonHTML).prependTo(context);
    },
    getGameMenuHTML(context) {
        if(!context) { return; }
        const gameMenuHTML = `
            <header class="game-header">
                <span>Pause in Game</span>
            </header>
            <ul class="game-toolbar__actions">
                <li class="game-toolbar__action">
                    <button id="continueButton" 
                        class="btn btn-primary btn-game">Continue Game</button>
                </li>
                <li class="game-toolbar__action">
                    <button id="resetButton" 
                        class="btn btn-primary btn-game">Reset Game</button>
                </li>
                <li class="game-toolbar__action">
                    <button id="newButton" 
                        class="btn btn-primary btn-game">New Game</button>
                </li>
            </ul>`;
        return $(gameMenuHTML).prependTo(context);
    }
};