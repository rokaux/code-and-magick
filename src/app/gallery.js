/** @fileoverview Модуль галереи фотографий отеля */

'use strict';

(function() {

  var utils = require('./utils');

  var galleryOverlay = document.querySelector('.overlay-gallery');
  var galleryClose = galleryOverlay.querySelector('.overlay-gallery-close');
  var photoPreview = galleryOverlay.querySelector('.overlay-gallery-preview');
  var photoPrev = galleryOverlay.querySelector('.overlay-gallery-control-left');
  var photoNext = galleryOverlay.querySelector('.overlay-gallery-control-right');
  var currentPhotoNumber = galleryOverlay.querySelector('.preview-number-current');
  var previewImg = new Image();
  var photoNumber = 0;
  var savedPhotos;

  /**
   * Сохраняем список фотографий
   * @param {NodeList} photos - List of images
   */
  function savedPhotoList(photos) {
    savedPhotos = photos;
  }

  /**
   * Добавляем всем фотографиям порядковый id.
   * Упрощает работу со списком фото в дальнейшем.
   * @param {NodeList} photos - List of images
   */
  function setPhotoID(photos) {
    for(var i = 0; i < photos.length; i++) {
      photos[i].id = i;
    }
  }
  setPhotoID(savedPhotos);

  /**
   * Добавляет элементу порядковый номер текущей фотографии.
   * @param {HTMLElement} element - Target html element
   * @param {number} - current photo index in NodeList
   */
  function setCurrentNumber(element, number) {
    element.textContent = parseInt(number, 10) + 1;
  }

  /**
   * Показывает фотографию по ее индексу в массиве
   * @param {number} - Index of current photo
   */
  function setActivePhoto(index) {
    previewImg.src = savedPhotos[index].src;
  }

  /**
   * Показывает блок галереи и устанавливает активную картинку,
   * добавляет обработчики событий
   * @param {HTMLElement} photo - current clicked photo
   */
  function showGallery(photo) {
    photoNumber = photo.id;

    previewImg.classList.add('preview-img');
    photoPreview.appendChild(previewImg);
    setActivePhoto(photoNumber);
    setCurrentNumber(currentPhotoNumber, photoNumber);

    galleryClose.addEventListener('click', _onCloseClick);
    document.addEventListener('keydown', _onDocumentKeyDown);
    photoPrev.addEventListener('click', _onPrevClick);
    photoNext.addEventListener('click', _onNextClick);

    utils.showElement(galleryOverlay);
  }

  /**
   * Скрывает блок галереи, удаляет динамически созданную разметку
   * и удаляет все обработчики событий
   */
  function hideGallery() {
    utils.hideElement(galleryOverlay);
    photoPreview.removeChild(previewImg);

    galleryClose.removeEventListener('click', _onCloseClick);
    document.removeEventListener('keydown', _onDocumentKeyDown);
    photoPrev.removeEventListener('click', _onPrevClick);
    photoNext.removeEventListener('click', _onNextClick);
  }

  /**
   * Функция показа предыдущей фотографии
   */
  function showPrevPhoto() {
    if(photoNumber > 0) {
      photoNumber--;
      setActivePhoto(photoNumber);
      setCurrentNumber(currentPhotoNumber, photoNumber);
    }
  }

  /**
   * Функция показа следующей фотографии
   */
  function showNextPhoto() {
    if(photoNumber < (savedPhotos.length - 1)) {
      photoNumber++;
      setActivePhoto(photoNumber);
      setCurrentNumber(currentPhotoNumber, photoNumber);
    }
  }

  /**
   * Обработчик события: нжатия esc
   */
  function _onDocumentKeyDown(evt) {
    if(evt.keyCode === 27) {
      evt.preventDefault();
      hideGallery();
    }
  }

  /**
   * Обработчик события: нжатия на крестик
   */
  function _onCloseClick(evt) {
    evt.preventDefault();
    hideGallery();
  }

  /**
   * Обработчик события: нжатия левой стрелки
   */
  function _onPrevClick() {
    showPrevPhoto();
  }

  /**
   * Обработчик события: нжатия правой стрелки
   */
  function _onNextClick() {
    showNextPhoto();
  }

  /**
   * Экспортируем методы
   */
  module.exports = {
    savedPhotoList: savedPhotoList,
    setPhotoID: setPhotoID,
    showGallery: showGallery
  };

})();
