/** @fileoverview Модуль содержащий объект, описывающий отзыв:
* - получение данных
* - отрисовку на странице
* - добавление обработчиков событий
* - удаление элемента со страницы и очистку памяти
*/

'use strict';

var getReviewElement = require('./get-review-element');

/**
 * @param {Object} data
 * @param {Element} container
 * @constructor
 */
var Review = function(data, container) {
  this.data = data;
  this.element = getReviewElement(this.data, container);

  this.onReviewClick = function(evt) {
    if (evt.target.classList.contains('review-quiz-answer')) {
      Array.prototype.forEach.call(evt.target.parentNode.children, function(item) {
        item.classList.remove('review-quiz-answer-active');
      });
      evt.target.classList.add('review-quiz-answer-active');
    }
  };

  this.remove = function() {
    this.element.removeEventListener('click', this.onReviewClick);
    this.element.parentNode.removeChild(this.element);
  };

  this.element.addEventListener('click', this.onReviewClick);
  container.appendChild(this.element);
};

module.exports = Review;
