/** @fileoverview Модуль, который отрисовывает список отзывов на странице: */

'use strict';

var FilterType = require('../filters/filter-type');
var filter = require('../filters/filter');
var utils = require('../utils');
var Review = require('./review');

var reviewsSection = document.querySelector('.reviews');
var reviewsFilters = reviewsSection.querySelector('.reviews-filter');
var reviewsContainer = reviewsSection.querySelector('.reviews-list');
var loadMoreBtn = reviewsSection.querySelector('.reviews-controls-more');
var reviews = [];

/**
* Константа - время таймаута загрузки отзывов
* @constant {number}
*/
var REVIEWS_LOAD_TIMEOUT = 5000;

/**
* Константа - ссылка на файл с отзывами
* @constant {link}
*/
var REVIEWS_LOAD_URL = '//o0.github.io/assets/json/reviews.json';

/**
* Константа - фильтр по умолчанию
* @constant {Filter}
*/
var DEFAULT_FILTER = FilterType.ALL;

/**
* Константа - количество отзывов на страницу
* @constant {number}
*/
var PAGE_SIZE = 3;

/**
 * Cостояние списка отзывов с учетом примененного фильтра.
 * Используется для отрисовки.
 * @type {Array}
 */
var filteredReviews = [];

/**
* Номер отрисованной страницы (значение по умолчанию, т.е. первая страница)
* @type {number}
*/
var pageNumber = 0;

/*
* Скрываем филтры до загрузки списка отзывов
*/
utils.hideElement(reviewsFilters);

/**
 * Массив отрисованных объектов отзывов
 * @type {Array.<Review>}
 */
var renderedReviews = [];

/**
* Функция отрисовки отзывов, которая в цикле
* запускает функцию добавления отзыва на страницу
* @param {Array.<Object>} reviews
* @param {number} page
* @param {boolean} reset
*/
var renderReviews = function(loadedReviews, page, reset) {
  if (reset) {
    pageNumber = 0;
    renderedReviews.forEach(function(review) {
      review.remove();
    });

    renderedReviews = [];
  }

  var from = page * PAGE_SIZE;
  var to = from + PAGE_SIZE;

  var container = document.createDocumentFragment();

  loadedReviews.slice(from, to).forEach(function(review) {
    renderedReviews.push(new Review(review, container));
  });

  reviewsContainer.appendChild(container);
};

/**
* Функция в зависимости от переданного параметра (id)
* фильтрует список отзывов
* @param {FilterType} filterType
*/
var applyFilter = function(filterType) {
  filteredReviews = filter(reviews, filterType);
  pageNumber = 0;
  renderReviews(filteredReviews, pageNumber, true);
};

/*
* Функция показывает блок с фильтрами
* и добавляет обработчик клика по фильтру
*/
var applyFiltration = function() {
  utils.showElement(reviewsFilters);
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
  utils.showElement(loadMoreBtn);
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
