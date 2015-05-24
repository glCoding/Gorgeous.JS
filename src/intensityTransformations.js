(function () {
	'use strict';
	var g = gorgeous;
	
	g.ImageData.prototype.negative = function () {
		var imd = this.constructor.call(null, this);
		for (var i = 0; i < imd.data.length; i += 4) {
			for (var j = i; j < i+3; j++) {
				imd.data[j] = 255 - imd.data[j];
			}
		}
		imd.pushChange();
		return imd;
	};

	g.ImageData.prototype.transform = function (typeString) {
		
	};
} ());
