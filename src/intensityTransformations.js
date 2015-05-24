(function () {
	'use strict';
	var g = gorgeous;
	
	g.ImageData.prototype.negative = function () {
		for (var i = 0; i < this.data.length; i++) {
			this.data[i] = 255 - this.data[i];
		}
		this.pushChange();
		return this;
	};
	
	g.ImageData.prototype.transform = function (typeString) {
		
	};
} ());
