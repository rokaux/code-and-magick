/** @fileoverview Модуль содержащий вспомогательные функции и методы, используемые в проекте */

'use strict';

/**
 * Показываем элемент
 */
function showElement(element) {
  element.classList.remove('invisible');
}

/**
 * Скрываем элемент
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
 */
function isElementVisible(target) {
  var targetPosition = target.getBoundingClientRect();
  return targetPosition.bottom > 0;
}

/**
 * Смещение элемента на скролл сртаницы. Параллакс эффект
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
