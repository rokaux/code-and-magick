/** @fileoverview Модуль галереи фотографий отеля */

'use strict';

var utils = require('./utils');

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
   * @param {number} - Index of current photo
   */
  this.setActivePhoto = function(index) {
    previewImg.src = photoList[index].src;
  };

  /**
   * Метод показывает блок галереи и устанавливает активную картинку,
   * добавляет обработчики событий
   * @param {HTMLElement} photo - current clicked photo
   */
  this.show = function(photo) {
    photoNumber = photo.id;

    previewImg.classList.add('preview-img');
    photoPreview.appendChild(previewImg);
    self.setActivePhoto(photoNumber);
    self.setCurrentNumber(currentPhotoNumber, photoNumber);

    galleryClose.addEventListener('click', self._onCloseClick);
    document.addEventListener('keydown', self._onDocumentKeyDown);
    photoPrev.addEventListener('click', self._onPrevClick);
    photoNext.addEventListener('click', self._onNextClick);

    utils.showElement(galleryOverlay);
  };

  /**
   * Метод скрывает блок галереи, удаляет динамически созданную разметку
   * и удаляет все обработчики событий
   */
  this.hide = function() {
    utils.hideElement(galleryOverlay);
    photoPreview.removeChild(previewImg);

    galleryClose.removeEventListener('click', self._onCloseClick);
    document.removeEventListener('keydown', self._onDocumentKeyDown);
    photoPrev.removeEventListener('click', self._onPrevClick);
    photoNext.removeEventListener('click', self._onNextClick);
  };

  /**
   * Метод показа предыдущей фотографии
   */
  this.showPrevPhoto = function() {
    if(photoNumber > 0) {
      photoNumber--;
      self.setActivePhoto(photoNumber);
      self.setCurrentNumber(currentPhotoNumber, photoNumber);
    }
  };

  /**
   * Метод показа следующей фотографии
   */
  this.showNextPhoto = function() {
    if(photoNumber < (photoList.length - 1)) {
      photoNumber++;
      self.setActivePhoto(photoNumber);
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
    self.showPrevPhoto();
  };

  /**
   * Обработчик события: нжатия правой стрелки
   */
  this._onNextClick = function() {
    self.showNextPhoto();
  };
};

module.exports = Gallery;
