/** @fileoverview Основной файл, который собирает все зависимости */

'use strict';

/**
 * Вспомогательные методы и функции: utils.js
 */
require('./app/utils');

/**
 * Модуль валидации формы отзывов: form.js
 */
require('./app/form');

/**
 * Основной модуль игры: game.js
 */
require('./app/game');

/**
 * Модуль галереи: gallery.js
 */
require('./app/gallery');

/**
 * Модуль загрузки и вывода отзывов: reviews.js
 */
require('./app/reviews');
