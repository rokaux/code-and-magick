/** @fileoverview Модуль галереи фотографий отеля */

'use strict';

var utils = require('./utils');

/**
 * Конструктор галереи
 * @param {NodeList} photoList - list of photos
 * @constructor
 */
var Gallery = function(photoList) {
  this.photos = photoList;
  this.galleryOverlay = document.querySelector('.overlay-gallery');
  this.galleryClose = this.galleryOverlay.querySelector('.overlay-gallery-close');
  this.photoPreview = this.galleryOverlay.querySelector('.overlay-gallery-preview');
  this.photoPrev = this.galleryOverlay.querySelector('.overlay-gallery-control-left');
  this.photoNext = this.galleryOverlay.querySelector('.overlay-gallery-control-right');
  this.currentPhotoNumber = this.galleryOverlay.querySelector('.preview-number-current');
  this.previewImg = new Image();
  this.photoNumber = 0;
  this.hashRegExp = /#photo\/(\S+)/;
  this.photoSrcRegExp = /(img\/\S+)/;

  this.setPhotoID = this.setPhotoID.bind(this)(this.photos);
  this.setCurrentNumber = this.setCurrentNumber.bind(this);
  this.setActivePhoto = this.setActivePhoto.bind(this);
  this.show = this.show.bind(this);
  this.hide = this.hide.bind(this);
  this.prevPhoto = this.prevPhoto.bind(this);
  this.nextPhoto = this.nextPhoto.bind(this);
  this._onDocumentKeyDown = this._onDocumentKeyDown.bind(this);
  this._onCloseClick = this._onCloseClick.bind(this);
  this._onPrevClick = this._onPrevClick.bind(this);
  this._onNextClick = this._onNextClick.bind(this);
  this._onHashChange = this._onHashChange.bind(this);

  this._onHashChange();
  window.addEventListener('hashchange', this._onHashChange);
};

/**
 * Метод добавляет всем фотографиям порядковый id.
 * Упрощает работу со списком фото в дальнейшем.
 * @param {NodeList} photoList - List of images
 */
Gallery.prototype.setPhotoID = function(photos) {
  for(var i = 0; i < this.photos.length; i++) {
    photos[i].id = i;
  }
};

/**
 * Метод добавляет элементу порядковый номер текущей фотографии.
 * @param {HTMLElement} element - Target html element
 * @param {number} - current photo index in NodeList
 */
Gallery.prototype.setCurrentNumber = function(element, number) {
  element.textContent = parseInt(number, 10) + 1;
};

/**
 * Метод показывает фотографию по ее индексу в массиве
 * @param {number || string} - Index of current photo
 */
Gallery.prototype.setActivePhoto = function(photo) {
  if(typeof photo === 'string') {
    var photoSrc = photo.match(this.photoSrcRegExp)[1];
    this.previewImg.src = photoSrc;
    this.photoNumber = document.querySelector('img[src="' + photoSrc + '"]').id;
  } else {
    this.photoNumber = photo.id;
    this.previewImg.src = this.photos[this.photoNumber].src;
  }
};

/**
 * Метод показывает блок галереи и устанавливает активную картинку,
 * добавляет обработчики событий
 * @param {HTMLElement || srting} photo - current clicked photo or link to current photo
 */
Gallery.prototype.show = function(target) {
  this.setActivePhoto(target);
  this.setCurrentNumber(this.currentPhotoNumber, this.photoNumber);

  this.previewImg.classList.add('preview-img');
  this.photoPreview.appendChild(this.previewImg);

  this.galleryClose.addEventListener('click', this._onCloseClick);
  document.addEventListener('keydown', this._onDocumentKeyDown);
  this.photoPrev.addEventListener('click', this._onPrevClick);
  this.photoNext.addEventListener('click', this._onNextClick);

  utils.showElement(this.galleryOverlay);
};

/**
 * Метод скрывает блок галереи, удаляет динамически созданную разметку,
 * чистит хэш адресной строки и удаляет все обработчики событий
 */
Gallery.prototype.hide = function() {
  utils.hideElement(this.galleryOverlay);
  this.photoPreview.removeChild(this.previewImg);

  history.pushState('', document.title, window.location.pathname);

  this.galleryClose.removeEventListener('click', this._onCloseClick);
  document.removeEventListener('keydown', this._onDocumentKeyDown);
  this.photoPrev.removeEventListener('click', this._onPrevClick);
  this.photoNext.removeEventListener('click', this._onNextClick);
};

/**
 * Предыдущая фотография
 */
Gallery.prototype.prevPhoto = function() {
  if(this.photoNumber > 0) {
    this.photoNumber--;
    location.hash = '#photo/' + this.photos[this.photoNumber].src.match(this.photoSrcRegExp)[1];
    this.setCurrentNumber(this.currentPhotoNumber, this.photoNumber);
  }
};

/**
 * Следующая фотография
 */
Gallery.prototype.nextPhoto = function() {
  if(this.photoNumber < (this.photos.length - 1)) {
    this.photoNumber++;
    location.hash = '#photo/' + this.photos[this.photoNumber].src.match(this.photoSrcRegExp)[1];
    this.setCurrentNumber(this.currentPhotoNumber, this.photoNumber);
  }
};

/**
 * Обработчик события: нжатия esc
 */
Gallery.prototype._onDocumentKeyDown = function(evt) {
  if(evt.keyCode === 27) {
    evt.preventDefault();
    this.hide();
  }
};

/**
 * Обработчик события: нжатия на крестик
 */
Gallery.prototype._onCloseClick = function(evt) {
  evt.preventDefault();
  this.hide();
};

/**
 * Обработчик события: нжатия левой стрелки
 */
Gallery.prototype._onPrevClick = function() {
  this.prevPhoto();
};

/**
 * Обработчик события: нжатия правой стрелки
 */
Gallery.prototype._onNextClick = function() {
  this.nextPhoto();
};

/**
 * Обработчик события: изменения хэша адресной строки
 */
Gallery.prototype._onHashChange = function() {
  if(location.hash.match(this.hashRegExp) !== null) {
    this.show(location.hash);
  }
};

var photoGallery = document.querySelector('.photogallery');
var photosList = photoGallery.querySelectorAll('img');
var gallery = new Gallery(photosList);

module.exports = gallery;
