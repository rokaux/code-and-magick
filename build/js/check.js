"use strict";

function getMessage(a, b) {
	if (typeof a === "boolean") {
		if (a === true) {
			return "Я попал в " + b;
		} else {
			return "Я никуда не попал";
		}
	} else if (typeof a === "number") {
		return "Я прыгнул на " + a * 100 + " сантиметров";
	} else if (a instanceof Array) {
		var sum = 0,
				length = 0;
		for (var i = 0; i < a.length; i++) {
			sum += a[i];
		}
		if (a instanceof Array && b instanceof Array) {
			for (var i = 0; i < a.length; i++) {
				length += a[i] * b[i];
			}
			return "Я прошёл " + length + " метров";
		}
		return "Я прошёл " + sum + " шагов";
	} 
}