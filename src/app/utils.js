/** @fileoverview Модуль содержащий вспомогательные функции и методы, используемые в проекте */

'use strict';

module.exports = {

  /**
   * Показываем элемент
   */
  showElement: function(element) {
    element.classList.remove('invisible');
  },

  /**
   * Скрываем элемент
   */
  hideElement: function(element) {
    element.classList.add('invisible');
  },

  /**
   * Метод Троттлинг (пропуск кадров)
   */
  throttle: function(callback, limit) {
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
  },

  /**
   * Метод, который проверяет виден ли блок на экране
   */
  isElementVisible: function(target) {
    var targetPosition = target.getBoundingClientRect();
    return targetPosition.bottom > 0;
  },

  /**
   * Смещение элемента на скролл сртаницы. Параллакс эффект
   */
  elementMove: function(element) {
    var elementPosition = element.getBoundingClientRect();
    element.style.left = elementPosition.top + 'px';
  }

};
