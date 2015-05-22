(function () {
	'use strict';
	var g = gorgeous;

	g.loadImage = function (src, callback) {
		var img = new Image();
		img.onload = function (e) {
			callback(img, e);
		};
		img.src = src;
		return img;
	};
	
	g.createCanvasContext = function (width, height) {
		var canvas = document.createElement('canvas');
		canvas.width = width || 0;
		canvas.height = height || 0;
		return canvas.getContext('2d');
	};
	
	g.getLevel = function (imd) {
		if(imd instanceof g.BinaryImageData) {
			return 3;
		} else if (imd instanceof g.GrayImageData) {
			return 2;
		} else if (imd instanceof g.ImageData) {
			return 1;
		}
	}

} ());
