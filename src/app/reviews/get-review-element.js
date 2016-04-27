/** @fileoverview Функция отрисовки отзыва на основе шаблона. */

'use strict';


var templateElement = document.querySelector('#review-template');
var elementToClone;

/*
* Клонируем шаблонный элемент, используя свойство content
* и фоллбэк для браузеров, которые не поддерживают тэг template
*/
if ('content' in templateElement) {
  elementToClone = templateElement.content.querySelector('.review');
} else {
  elementToClone = templateElement.querySelector('.review');
}

/**
* Константа - время таймаута загрузки картинок
* @constant {number}
*/
var IMAGE_LOAD_TIMEOUT = 5000;

/**
* @param {Object} data
* @param {HTMLElement} container
* @return {HTMLElement}
*/
var getReviewElement = function(data, container) {
  var element = elementToClone.cloneNode(true);
  element.querySelector('.review-rating').textContent = data.rating;
  element.querySelector('.review-text').textContent = data.description;

  var userAvatar = new Image();
  var userAvatarLoadTimeout;

  userAvatar.onload = function(evt) {
    clearTimeout(userAvatarLoadTimeout);
    element.querySelector('img').src = evt.target.src;
    element.querySelector('img').width = 124;
    element.querySelector('img').height = 124;
  };

  userAvatar.onerror = function() {
    element.classList.add('review-load-failure');
  };

  userAvatar.src = data.author.picture;
  userAvatarLoadTimeout = setTimeout(function() {
    element.querySelector('img').src = '';
    element.classList.add('review-load-failure');
  }, IMAGE_LOAD_TIMEOUT);

  container.appendChild(element);

  return element;
};

module.exports = getReviewElement;
