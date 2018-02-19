var GAME_SHAPES = {
  X: 1,
  O: 0
};
var WIN_TYPES = {
  ROW: "ROW",
  COLUMN: "COLUMN",
  MAIN_DIAGONAL: "MAIN_DIAGONAL",
  DIAGONAL: "DIAGONAL"
};

var getRandom = function getRandom(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};