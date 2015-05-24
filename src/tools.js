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
	
	g.makeBlank = function (imd, width, height) {
		imd.ctx = g.createCanvasContext(width || 1, height || 1);
		imd.width = width || 1;
		imd.height = height || 1;
		imd.nativeImageData = imd.ctx.getImageData(0, 0, width || 1, height || 1);
		imd.data = imd.nativeImageData.data;
	};

	g.createBlankImageData = function (which, width, height) {
		function Helper() {};
		Helper.prototype = which.prototype;
		var r = new Helper();
		g.makeBlank(r, width, height);
		return r;
	};

} ());
