//Test:Intensity Transformation Test
var g = gorgeous;
var canvas = document.createElement('canvas');
var ctx = canvas.getContext('2d');
var src = 'img/baboon.png';
var img = g.loadImage(src, function () {
	canvas.width = 200;
	canvas.height = 200;
	tests();
});

function tests() {
	Test(['Image Negative', function (test) {
		ctx.fillStyle = 'rgb(124, 224, 31)';
		ctx.fillRect(0, 0, 200, 200);
		var imd = new g.ImageData(ctx);
		var neimd = imd.negative();
		imd.getImage(function (img) {
			test.show('Original Image', img);
		});
		neimd.getImage(function (img) {
			test.show('Negative Image', img);
		});
		test.pass(neimd.getPixels().every(function (p) { return p.r === 131 && p.g === 31 && p.b === 224; }));
		imd = new g.ImageData(img);
		neimd = imd.negative();
		imd.getImage(function (img) {
			test.log('Baboon Test');
			test.show('Original Image', img);
		});
		neimd.getImage(function (img) {
			test.show('Negative Image', img);
		});
	}]);
}
