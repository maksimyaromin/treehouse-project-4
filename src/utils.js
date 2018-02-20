/* 
*/
/* Объект с игровыми фигурами (крестик и нолик)
*/
const GAME_SHAPES = { X: 1, O: 0 };

/* Справочников типов победы:
    победила строка, столбец, главная диагональ или побочная
    диагональ
*/
const WIN_TYPES = {
    ROW: "ROW",
    COLUMN: "COLUMN",
    MAIN_DIAGONAL: "MAIN_DIAGONAL",
    DIAGONAL: "DIAGONAL"
};

/* Вспомогательная функция для получения случайного числа
*/
const getRandom = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};