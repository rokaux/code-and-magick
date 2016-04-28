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
var gallery = require('./app/gallery');

/**
 * Модуль отрисовки отзывов на старнице с фильтрацией
 */
require('./app/reviews/render-reviews');



var photoGallery = document.querySelector('.photogallery');
var photosList = photoGallery.querySelectorAll('img');

/**
 * Инициализируем функцию сохранения списка фотографий
 */
gallery.savePhotoList(photosList);

/**
 * Инициализируем обработчик события клика по превью галереи
 */
photoGallery.addEventListener('click', function(evt) {
  if (evt.target.parentNode.classList.contains('photogallery-image')) {
    evt.preventDefault();
    gallery.showGallery(evt.target);
  }
});
