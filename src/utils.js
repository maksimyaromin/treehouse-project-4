/* Objects with game shapes (a cross and a notch)
*/
const GAME_SHAPES = { X: 1, O: 0 };

/* Winning type reference book:
    a string wins, column, main or secondary diagonal 
*/
const WIN_TYPES = {
    ROW: "ROW",
    COLUMN: "COLUMN",
    MAIN_DIAGONAL: "MAIN_DIAGONAL",
    DIAGONAL: "DIAGONAL"
};

/* Secondary function to obtain a random number
*/
const getRandom = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};