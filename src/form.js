'use strict';

(function() {
  var MIN_RATE = 3;

  var formContainer = document.querySelector('.overlay-container');
  var formOpenButton = document.querySelector('.reviews-controls-new');
  var formCloseButton = document.querySelector('.review-form-close');

  var reviewForm = formContainer.querySelector('.review-form');
  var reviewName = reviewForm.elements['review-name'];
  var reviewText = reviewForm.elements['review-text'];
  var reviewLabels = reviewForm.querySelector('.review-fields');
  var reviewNameLabel = reviewForm.querySelector('.review-fields-name');
  var reviewTextLabel = reviewForm.querySelector('.review-fields-text');
  var reviewMarks = reviewForm.querySelector('.review-form-group-mark');
  var reviewMark = reviewMarks.elements['review-mark'];
  var reviewSubmit = reviewForm.querySelector('.review-submit');

  /*
  * Вставка сообщений об ошибке в DOM документа
  */
  reviewName.insertAdjacentHTML('afterend', '<p style="color: red;" id="name-error"></p>');
  reviewText.insertAdjacentHTML('afterend', '<p style="color: red;" id="text-error"></p>');

  var reviewNameError = reviewForm.querySelector('#name-error');
  var reviewTextError = reviewForm.querySelector('#text-error');

  /*
  * Функция, задающая основные ограничения валидации
  */
  var formValidation = function() {
    reviewName.required = true;
    reviewText.required = reviewMark.value < MIN_RATE;

    var reviewNameStatus = reviewName.validity.valid;
    var reviewTextStatus = reviewText.validity.valid;

    if(reviewNameStatus) {
      reviewName.onchange = function() {
        reviewNameError.textContent = '';
      };
      reviewNameLabel.classList.add('invisible');
    } else {
      reviewName.onchange = function() {
        reviewNameError.textContent = this.validationMessage;
      };
      reviewNameLabel.classList.remove('invisible');
    }
    if(reviewTextStatus) {
      reviewText.onchange = function() {
        reviewTextError.textContent = '';
      };
      reviewTextLabel.classList.add('invisible');
    } else {
      reviewText.onchange = function() {
        reviewTextError.textContent = this.validationMessage;
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
    formValidation();
  };

  /*
  * Функция обработки события ввода данных в любое поле формы
  */
  reviewForm.oninput = function() {
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
