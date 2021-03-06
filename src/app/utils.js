/** @fileoverview Модуль содержащий вспомогательные функции и методы, используемые в проекте */

'use strict';

/**
 * Показываем элемент
 * @param {object} DOM Element to show
 */
function showElement(element) {
  element.classList.remove('invisible');
}

/**
 * Скрываем элемент
 * @param {object} DOM Element to hide
 */
function hideElement(element) {
  element.classList.add('invisible');
}

/**
 * Метод Троттлинг (пропуск кадров)
 */
function throttle(callback, limit) {
  var wait = false;
  return function() {
    if (!wait) {
      callback.call();
      wait = true;
      setTimeout(function() {
        wait = false;
      }, limit);
    }
  };
}

/**
 * Метод, который проверяет виден ли блок на экране
 * @param {object} DOM Element to check visibility of
 */
function isElementVisible(target) {
  var targetPosition = target.getBoundingClientRect();
  return targetPosition.bottom > 0;
}

/**
 * Смещение элемента на скролл сртаницы. Параллакс эффект
 * @param {object} DOM Element to move
 */
function elementMove(element) {
  var elementPosition = element.getBoundingClientRect();
  element.style.left = elementPosition.top + 'px';
}

/**
 * Экспортируем методы
 */
module.exports = {
  showElement: showElement,
  hideElement: hideElement,
  throttle: throttle,
  isElementVisible: isElementVisible,
  elementMove: elementMove
};
