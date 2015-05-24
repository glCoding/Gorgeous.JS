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
	}],
	['Image Log Transformation', function (test) {
		ctx.fillStyle = 'rgb(124, 224, 31)';
		ctx.fillRect(0, 0, 200, 200);
		var imd = new g.ImageData(ctx);
		var neimd = imd.log(2);
		imd.getImage(function (img) {
			test.show('Original Image', img);
		});
		neimd.getImage(function (img) {
			test.show('Transformed Image', img);
		});
		test.pass(neimd.getPixels().every(function (p) { return p.r === 222 && p.g === 249 && p.b === 159; }));
		imd = new g.ImageData(img);
		neimd = imd.log(2);
		imd.getImage(function (img) {
			test.log('Baboon Test');
			test.show('Original Image', img);
		});
		neimd.getImage(function (img) {
			test.show('Transformed Image', img);
		});
	}],
	['Image Exponential Transformation', function (test) {
		ctx.fillStyle = 'rgb(124, 224, 31)';
		ctx.fillRect(0, 0, 200, 200);
		var imd = new g.ImageData(ctx);
		var neimd = imd.exp(1.01);
		imd.getImage(function (img) {
			test.show('Original Image', img);
		});
		neimd.getImage(function (img) {
			test.show('Transformed Image', img);
		});
		test.pass(neimd.getPixels().every(function (p) { return p.r === 53 && p.g === 182 && p.b === 8; }));
		imd = new g.ImageData(img);
		neimd = imd.exp(1.01);
		imd.getImage(function (img) {
			test.log('Baboon Test');
			test.show('Original Image', img);
		});
		neimd.getImage(function (img) {
			test.show('Transformed Image', img);
		});
	}],
	['Image Power Transformation', function (test) {
		ctx.fillStyle = 'rgb(124, 224, 31)';
		ctx.fillRect(0, 0, 200, 200);
		var imd = new g.ImageData(ctx);
		var neimd = imd.pow(2);
		imd.getImage(function (img) {
			test.show('Original Image', img);
		});
		neimd.getImage(function (img) {
			test.show('Transformed Image', img);
		});
		test.pass(neimd.getPixels().every(function (p) { return p.r === 60 && p.g === 197 && p.b === 4; }));
		imd = new g.ImageData(img);
		neimd = imd.pow(2);
		imd.getImage(function (img) {
			test.log('Baboon Test');
			test.show('Original Image', img);
		});
		neimd.getImage(function (img) {
			test.show('Transformed Image', img);
		});
	}],
	['Image Root Transformation', function (test) {
		ctx.fillStyle = 'rgb(124, 224, 31)';
		ctx.fillRect(0, 0, 200, 200);
		var imd = new g.ImageData(ctx);
		var neimd = imd.root(2);
		imd.getImage(function (img) {
			test.show('Original Image', img);
		});
		neimd.getImage(function (img) {
			test.show('Transformed Image', img);
		});
		test.pass(neimd.getPixels().every(function (p) { return p.r === 178 && p.g === 239 && p.b === 89; }));
		imd = new g.ImageData(img);
		neimd = imd.root(2);
		imd.getImage(function (img) {
			test.log('Baboon Test');
			test.show('Original Image', img);
		});
		neimd.getImage(function (img) {
			test.show('Transformed Image', img);
		});
	}]
	);
}
