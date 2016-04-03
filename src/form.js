'use strict';

(function() {
  var MIN_RATE = 3;

  var formContainer = document.querySelector('.overlay-container');
  var formOpenButton = document.querySelector('.reviews-controls-new');
  var formCloseButton = document.querySelector('.review-form-close');

  var reviewForm = document.querySelector('.review-form');
  var reviewName = reviewForm.elements['review-name'];
  var reviewText = reviewForm.elements['review-text'];
  var reviewLabels = document.querySelector('.review-fields');
  var reviewNameLabel = document.querySelector('.review-fields-name');
  var reviewTextLabel = document.querySelector('.review-fields-text');
  var reviewMarks = document.querySelector('.review-form-group-mark');
  var reviewMark = reviewMarks.elements['review-mark'];
  var reviewSubmit = document.querySelector('.review-submit');

  /*
  * Функция, задающая основные ограничения валидации
  */
  var formValidation = function() {
    reviewName.required = true;
    reviewText.required = reviewMark.value < MIN_RATE;

    var reviewNameStatus = reviewName.validity.valid;
    var reviewTextStatus = reviewText.validity.valid;
    var reviewNameError = '<p style="color: red;">' + reviewName.validationMessage + '</p>';
    var reviewTextError = '<p style="color: red;">' + reviewText.validationMessage + '</p>';

    if(reviewNameStatus) {
      reviewName.onchange = function() {
        return;
      };
      reviewNameLabel.classList.add('invisible');
    } else {
      reviewName.onchange = function() {
        this.insertAdjacentHTML('afterend', reviewNameError);
      };
      reviewNameLabel.classList.remove('invisible');
    }
    if(reviewTextStatus) {
      reviewText.onchange = function() {
        return;
      };
      reviewTextLabel.classList.add('invisible');
    } else {
      reviewText.onchange = function() {
        this.insertAdjacentHTML('afterend', reviewTextError);
      };
      reviewTextLabel.classList.remove('invisible');
    }
    if(reviewNameStatus && reviewTextStatus) {
      reviewLabels.classList.add('invisible');
      reviewSubmit.disabled = false;
    } else {
      reviewSubmit.disabled = true;
      reviewLabels.classList.remove('invisible');
    }
  };

  /*
  * Инициализация функции formValidation() на загрузку старницы.
  * Чтобы все ограничения вступили в силу
  */
  formValidation();

  /*
  * Функция обработки события изменения оценки
  */
  reviewMarks.onchange = function() {
    reviewText.required = reviewMark.value < MIN_RATE;
    formValidation();
  };

  /*
  * Функция обработки события взаимодействия каким-либо полем формы
  */
  reviewForm.onkeyup = function() {
    formValidation();
  };

  formOpenButton.onclick = function(evt) {
    evt.preventDefault();
    formContainer.classList.remove('invisible');
  };

  formCloseButton.onclick = function(evt) {
    evt.preventDefault();
    formContainer.classList.add('invisible');
  };

})();
