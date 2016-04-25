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

  var photoGallery = document.querySelector('.photogallery');
  var photosList = photoGallery.querySelectorAll('img');
  var previewImg = new Image();
  var photoNumber = 0;

  /**
   * Добавляем всем фотографиям порядковый id.
   * Упрощает работу со списком фото в дальнейшем.
   * @param {NodeList} images
   */
  function setPhotoID(photos) {
    for(var i = 0; i < photos.length; i++) {
      photos[i].id = i + 1;
    }
  }
  setPhotoID(photosList);

  /**
   * Показывает фотографию по ее индексу в массиве
   * @param {number}
   */
  function setActivePhoto(index) {
    previewImg.src = photosList[index].src;
  }

  /**
   * Показывает блок галереи и устанавливает активную картинку,
   * добавляет обработчики событий
   * @param {number}
   */
  function showGallery(photo) {
    photoNumber = photo.id - 1;

    previewImg.classList.add('preview-img');
    photoPreview.appendChild(previewImg);

    setActivePhoto(photoNumber);
    currentPhotoNumber.textContent = photo.id;

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
      currentPhotoNumber.textContent = photoNumber + 1;
    }
  }

  /**
   * Функция показа следующей фотографии
   */
  function showNextPhoto() {
    if(photoNumber < (photosList.length - 1)) {
      photoNumber++;
      setActivePhoto(photoNumber);
      currentPhotoNumber.textContent = photoNumber + 1;
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
   * Инициализируем обработчик события клика по превью галереи
   */
  photoGallery.addEventListener('click', function(evt) {
    if (evt.target.parentNode.classList.contains('photogallery-image')) {
      evt.preventDefault();
      showGallery(evt.target);
    }
  });

})();
