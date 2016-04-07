'use strict';

(function() {

  var reviewsSection = document.querySelector('.reviews');
  var reviewsFilters = reviewsSection.querySelector('.reviews-filter');
  var reviewsContainer = reviewsSection.querySelector('.reviews-list');
  var templateElement = document.querySelector('#review-template');
  var elementToClone;

  /*
  * Скрываем филтры до загрузки списка отзывов
  */
  reviewsFilters.classList.add('invisible');

  /*
  * Клонируем шаблонный элемент, используя свойство content
  * и фоллбэк для браузеров, которые не поддерживают тэг template
  */
  if ('content' in templateElement) {
    elementToClone = templateElement.content.querySelector('.review');
  } else {
    elementToClone = templateElement.querySelector('.review');
  }

  /*
  * Константа - время тайиаута
  */
  var IMAGE_LOAD_TIMEOUT = 5000;

  /*
  * Функция, которая создает DOM-элемент отзыва и добавляет его на страницу
  */
  var getReviewElement = function(data, container) {
    var element = elementToClone.cloneNode(true);
    element.querySelector('.review-rating').textContent = data.rating;
    element.querySelector('.review-text').textContent = data.description;
    container.appendChild(element);

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

    return element;
  };

  /*
  * Функция, которая в цикле запускает функцию добавления отзыва на страницу
  */
  window.reviews.forEach(function(review) {
    getReviewElement(review, reviewsContainer);
  });

  /*
  * Показываем фильтры после загрузки отзывов
  */
  reviewsFilters.classList.remove('invisible');

})();
