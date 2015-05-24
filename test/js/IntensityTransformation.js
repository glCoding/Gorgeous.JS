//Test:Intensity Transformation Test
var g = gorgeous;
var canvas = document.createElement('canvas');
var ctx = canvas.getContext('2d');
var src = 'img/baboon.png';
var img = g.loadImage(src, function (img) {
	canvas.width = 200;
	canvas.height = 200;
	tests();
});

function tests() {
	Test(['Image Negative', function (test) {
		ctx.fillStyle = 'rgb(124, 224, 31)';
		ctx.fillRect(0, 0, 200, 200);
		var imd = g.ImageData(ctx);
		imd.negative();
	}]);
}
