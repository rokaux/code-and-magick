'use strict';

(function() {

  var reviewsSection = document.querySelector('.reviews');
  var reviewsFilters = reviewsSection.querySelector('.reviews-filter');
  var reviewsContainer = reviewsSection.querySelector('.reviews-list');
  var templateElement = document.querySelector('#review-template');
  var loadMoreBtn = reviewsSection.querySelector('.reviews-controls-more');
  var elementToClone;
  var reviews = [];
  var filteredReviews = [];
  var Filter = {
    'ALL': 'reviews-all',
    'RECENT': 'reviews-recent',
    'GOOD': 'reviews-good',
    'BAD': 'reviews-bad',
    'POPULAR': 'reviews-popular'
  };

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
  * Константа - время таймаута загрузки картинок
  */
  var IMAGE_LOAD_TIMEOUT = 5000;

  /*
  * Константа - время таймаута загрузки отзывов
  */
  var REVIEWS_LOAD_TIMEOUT = 5000;

  /*
  * Константа - ссылка на файл с отзывами
  */
  var REVIEWS_LOAD_URL = '//o0.github.io/assets/json/reviews.json';

  /*
  * Константа - фильтр по умолчанию
  */
  var DEFAULT_FILTER = Filter.ALL;

  /*
  * Константа - количество отзывов на страницу
  */
  var PAGE_SIZE = 3;

  /*
  * Номер отрисованной страницы (значение по умолчанию, т.е. первая страница)
  */
  var pageNumber = 0;

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
  * Функция отрисовки отзывов, которая в цикле
  * запускает функцию добавления отзыва на страницу
  */
  var renderReviews = function(loadedReviews, page, replace) {
    if (replace) {
      reviewsContainer.innerHTML = '';
    }

    var from = page * PAGE_SIZE;
    var to = from + PAGE_SIZE;

    loadedReviews.slice(from, to).forEach(function(review) {
      getReviewElement(review, reviewsContainer);
    });
  };

  /*
  * Функция, которая возвращает список отфильтрованных
  * по определенному критерию отзывов
  */
  var getFilteredReviews = function(reviewsList, filter) {
    var reviewsToFilter = reviewsList.slice(0);

    switch (filter) {
      case Filter.ALL:
        reviewsToFilter = reviews;
        break;
      case Filter.RECENT:
        reviewsToFilter.sort(function(a, b) {
          return new Date(b.date) - new Date(a.date);
        });
        var mostRecentDate = new Date(reviewsToFilter[0].date);
        var filterDate = mostRecentDate.valueOf() - (14 * 24 * 60 * 60 * 1000);

        reviewsToFilter = reviewsToFilter.filter(function(review) {
          return new Date(review.date).valueOf() > filterDate;
        });
        break;
      case Filter.GOOD:
        reviewsToFilter = reviewsToFilter.filter(function(review) {
          return review.rating >= 3;
        });
        reviewsToFilter.sort(function(a, b) {
          return b.rating - a.rating;
        });
        break;
      case Filter.BAD:
        reviewsToFilter = reviewsToFilter.filter(function(review) {
          return review.rating <= 2;
        });
        reviewsToFilter.sort(function(a, b) {
          return a.rating - b.rating;
        });
        break;
      case Filter.POPULAR:
        reviewsToFilter.sort(function(a, b) {
          return b.review_usefulness - a.review_usefulness;
        });
        break;
      default:
        reviewsToFilter = reviews;
        break;
    }
    return reviewsToFilter;
  };

  /*
  * Функция в зависимости от переданного параметра (id)
  * фильтрует список отзывов
  */
  var applyFilter = function(filter) {
    filteredReviews = getFilteredReviews(reviews, filter);
    pageNumber = 0;
    renderReviews(filteredReviews, pageNumber, true);
  };

  /*
  * Функция показывает блок с фильтрами
  * и добавляет обработчик клика по фильтру
  */
  var applyFiltration = function() {
    reviewsFilters.classList.remove('invisible');
    reviewsFilters.addEventListener('click', function(evt) {
      if (evt.target.hasAttribute('name')) {
        applyFilter(evt.target.id);
      }
    });
  };

  /*
  * Получаем список отелей с сервера по XHR
  */
  var getReviews = function(callback) {
    var xhr = new XMLHttpRequest();

    xhr.timeout = REVIEWS_LOAD_TIMEOUT;

    xhr.onload = function(evt) {
      if (this.status === 200) {
        var loadedData = JSON.parse(evt.target.response);
        reviewsSection.classList.remove('reviews-list-loading');
        callback(loadedData);
      }
    };

    xhr.onerror = function() {
      reviewsSection.classList.remove('reviews-list-loading');
      reviewsSection.classList.add('reviews-load-failure');
    };

    xhr.ontimeout = function() {
      reviewsSection.classList.remove('reviews-list-loading');
      reviewsSection.classList.add('reviews-load-failure');
    };

    xhr.open('GET', REVIEWS_LOAD_URL);
    xhr.send();

    reviewsSection.classList.add('reviews-list-loading');
  };

  /*
  * Проверяем есть ли сдледующая страница
  */
  var isNextPageAvailable = function(reviewsList, page, pageSize) {
    return page < Math.floor(reviewsList.length / pageSize);
  };

  /*
  * Подгружаем список отзывов постранично
  */
  var loadMoreReviews = function() {
    loadMoreBtn.classList.remove('invisible');
    loadMoreBtn.addEventListener('click', function() {
      if (isNextPageAvailable(reviews, pageNumber, PAGE_SIZE)) {
        pageNumber++;
        renderReviews(filteredReviews, pageNumber);
      }
    });
  };

  getReviews(function(loadedReviews) {
    reviews = loadedReviews;
    applyFiltration();
    applyFilter(DEFAULT_FILTER);
    loadMoreReviews();
  });
})();
