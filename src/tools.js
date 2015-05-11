var gonzalez = gonzalez || {};
var g = gonzalez;

g.loadImage = function (src, callback) {
	var img = new Image();
	img.onload = callback;
	img.src = src;
	return img;
};
