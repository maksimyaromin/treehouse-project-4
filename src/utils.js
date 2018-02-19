const GAME_SHAPES = { X: 1, O: 0 };

const WIN_TYPES = {
    ROW: "ROW",
    COLUMN: "COLUMN",
    MAIN_DIAGONAL: "MAIN_DIAGONAL",
    DIAGONAL: "DIAGONAL"
};

const getRandom = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};