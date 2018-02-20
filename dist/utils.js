/* 
*/

/* Объект с игровыми фигурами (крестик и нолик)
*/
var GAME_SHAPES = {
  X: 1,
  O: 0
};
/* Справочников типов победы:
    победила строка, столбец, главная диагональ или побочная
    диагональ
*/

var WIN_TYPES = {
  ROW: "ROW",
  COLUMN: "COLUMN",
  MAIN_DIAGONAL: "MAIN_DIAGONAL",
  DIAGONAL: "DIAGONAL"
};
/* Вспомогательная функция для получения случайного числа
*/

var getRandom = function getRandom(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};