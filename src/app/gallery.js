/** @fileoverview Модуль галереи фотографий отеля */

'use strict';

var utils = require('./utils');
/**
 * Конструктор галереи
 * @constructor
 */
var Gallery = function(photoList) {
  var self = this;
  var galleryOverlay = document.querySelector('.overlay-gallery');
  var galleryClose = galleryOverlay.querySelector('.overlay-gallery-close');
  var photoPreview = galleryOverlay.querySelector('.overlay-gallery-preview');
  var photoPrev = galleryOverlay.querySelector('.overlay-gallery-control-left');
  var photoNext = galleryOverlay.querySelector('.overlay-gallery-control-right');
  var currentPhotoNumber = galleryOverlay.querySelector('.preview-number-current');
  var previewImg = new Image();
  var photoNumber = 0;
  var hashRegExp = /#photo\/(\S+)/;
  var photoSrcRegExp = /(img\/\S+)/;

  /**
   * Метод добавляет всем фотографиям порядковый id.
   * Упрощает работу со списком фото в дальнейшем.
   * @param {NodeList} photoList - List of images
   */
  this.setPhotoID = (function(photos) {
    for(var i = 0; i < photoList.length; i++) {
      photos[i].id = i;
    }
  })(photoList);

  /**
   * Метод добавляет элементу порядковый номер текущей фотографии.
   * @param {HTMLElement} element - Target html element
   * @param {number} - current photo index in NodeList
   */
  this.setCurrentNumber = function(element, number) {
    element.textContent = parseInt(number, 10) + 1;
  };

  /**
   * Метод показывает фотографию по ее индексу в массиве
   * @param {number || string} - Index of current photo
   */
  this.setActivePhoto = function(photo) {
    if(typeof photo === 'string') {
      var photoSrc = photo.match(photoSrcRegExp)[1];
      previewImg.src = photoSrc;
      photoNumber = document.querySelector('img[src="' + photoSrc + '"]').id;
    } else {
      photoNumber = photo.id;
      previewImg.src = photoList[photoNumber].src;
    }
  };

  /**
   * Метод показывает блок галереи и устанавливает активную картинку,
   * добавляет обработчики событий
   * @param {HTMLElement || srting} photo - current clicked photo or link to current photo
   */
  this.show = function(target) {
    self.setActivePhoto(target);
    self.setCurrentNumber(currentPhotoNumber, photoNumber);

    previewImg.classList.add('preview-img');
    photoPreview.appendChild(previewImg);

    galleryClose.addEventListener('click', self._onCloseClick);
    document.addEventListener('keydown', self._onDocumentKeyDown);
    photoPrev.addEventListener('click', self._onPrevClick);
    photoNext.addEventListener('click', self._onNextClick);

    utils.showElement(galleryOverlay);
  };

  /**
   * Метод скрывает блок галереи, удаляет динамически созданную разметку,
   * чистит хэш адресной строки и удаляет все обработчики событий
   */
  this.hide = function() {
    utils.hideElement(galleryOverlay);
    photoPreview.removeChild(previewImg);

    history.pushState('', document.title, window.location.pathname);

    galleryClose.removeEventListener('click', self._onCloseClick);
    document.removeEventListener('keydown', self._onDocumentKeyDown);
    photoPrev.removeEventListener('click', self._onPrevClick);
    photoNext.removeEventListener('click', self._onNextClick);
  };

  /**
   * Предыдущая фотографии
   */
  this.prevPhoto = function() {
    if(photoNumber > 0) {
      photoNumber--;
      location.hash = '#photo/' + photoList[photoNumber].src.match(photoSrcRegExp)[1];
      self.setCurrentNumber(currentPhotoNumber, photoNumber);
    }
  };

  /**
   * Следующая фотография
   */
  this.nextPhoto = function() {
    if(photoNumber < (photoList.length - 1)) {
      photoNumber++;
      location.hash = '#photo/' + photoList[photoNumber].src.match(photoSrcRegExp)[1];
      self.setCurrentNumber(currentPhotoNumber, photoNumber);
    }
  };

  /**
   * Обработчик события: нжатия esc
   */
  this._onDocumentKeyDown = function(evt) {
    if(evt.keyCode === 27) {
      evt.preventDefault();
      self.hide();
    }
  };

  /**
   * Обработчик события: нжатия на крестик
   */
  this._onCloseClick = function(evt) {
    evt.preventDefault();
    self.hide();
  };

  /**
   * Обработчик события: нжатия левой стрелки
   */
  this._onPrevClick = function() {
    self.prevPhoto();
  };

  /**
   * Обработчик события: нжатия правой стрелки
   */
  this._onNextClick = function() {
    self.nextPhoto();
  };

  /**
   * Обработчик события: изменения хэша ад
   */
  this._onHashChange = function() {
    if(location.hash.match(hashRegExp) !== null) {
      self.show(location.hash);
    }
  };
  this._onHashChange();

  window.addEventListener('hashchange', this._onHashChange);

};

var photoGallery = document.querySelector('.photogallery');
var photosList = photoGallery.querySelectorAll('img');
var gallery = new Gallery(photosList);

module.exports = gallery;
