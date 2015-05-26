//Test:Test g.ImageData constructor
var g = gorgeous;

var src = 'img/baboon.png';
var tip = document.createElement('h3');
tip.innerHTML = 'Loading baboon image, please wait...';
document.body.appendChild(tip);
g.loadImage(src, function (img) {
	tip.innerHTML = 'Baboon image loaded.';
	var ctx = g.makeCanvasContext(img.width, img.height);
	ctx.drawImage(img, 0, 0, img.width, img.height);
	var canvas = ctx.canvas;
	Test(
		['g.ImageData constructor with string parameter', function (test) {
			g.ImageData(src, function (imd) {
				test.log(imd);
				test.pass(imd.width === imd.height && imd.width === 512);
			});
		}],
		['g.ImageData constructor with Image parameter', function (test) {
			var imd = g.ImageData(img);
			test.log(imd);
			test.pass(imd.width === imd.height && imd.width === 512);
		}],
		['g.ImageData constructor with native ImageData parameter', function (test) {
			var imd = g.ImageData(ctx.getImageData(0, 0, canvas.width, canvas.height));
			test.log(imd);
			test.pass(imd.width === imd.height && imd.width === 512);
		}],
		['g.ImageData constructor with Canvas parameter', function (test) {
			var imd = g.ImageData(canvas);
			test.log(imd);
			test.pass(imd.width === imd.height && imd.width === 512);
		}],
		['g.ImageData constructor with Context parameter', function (test) {
			var imd = g.ImageData(ctx);
			test.log(imd);
			test.pass(imd.width === imd.height && imd.width === 512);
		}],
		['g.ImageData constructor with g.ImageData parameter', function (test) {
			var imd = g.ImageData(g.ImageData(canvas));
			test.log(imd);
			test.pass(imd.width === imd.height && imd.width === 512);
		}]
		);
});
