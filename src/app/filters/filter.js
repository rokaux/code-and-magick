/** @fileoverview Доступные виды фильтров */

'use strict';

var FilterType = require('./filter-type');

/**
 * @param {Array.<Object>} reviews
 * @param {FilterType} filterType
 * @return {Array.<Object>}
 */
var filter = function(reviewsList, filterType) {
  var reviewsToFilter = reviewsList.slice(0);

  switch (filterType) {
    case FilterType.ALL:
      reviewsToFilter = reviewsList;
      break;
    case FilterType.RECENT:
      reviewsToFilter.sort(function(a, b) {
        return new Date(b.date) - new Date(a.date);
      });
      var mostRecentDate = new Date(reviewsToFilter[0].date);
      var filterDate = mostRecentDate.valueOf() - (14 * 24 * 60 * 60 * 1000);

      reviewsToFilter = reviewsToFilter.filter(function(review) {
        return new Date(review.date).valueOf() > filterDate;
      });
      break;
    case FilterType.GOOD:
      reviewsToFilter = reviewsToFilter.filter(function(review) {
        return review.rating >= 3;
      });
      reviewsToFilter.sort(function(a, b) {
        return b.rating - a.rating;
      });
      break;
    case FilterType.BAD:
      reviewsToFilter = reviewsToFilter.filter(function(review) {
        return review.rating <= 2;
      });
      reviewsToFilter.sort(function(a, b) {
        return a.rating - b.rating;
      });
      break;
    case FilterType.POPULAR:
      reviewsToFilter.sort(function(a, b) {
        return b.review_usefulness - a.review_usefulness;
      });
      break;
    default:
      reviewsToFilter = reviewsList;
      break;
  }
  return reviewsToFilter;
};

module.exports = filter;
