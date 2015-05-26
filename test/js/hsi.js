//Test:HSI&RGB Test
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
		['getR/G/B', function (test) {
			g.ImageData(src, function (imd) {
				var r = imd.getR();
				r.getImage(function (img) {
					test.show('Red Channel', img);
				});
				var g = imd.getG();
				g.getImage(function (img) {
					test.show('Green Channel', img);
				});
				var b = imd.getB();
				b.getImage(function (img) {
					test.show('Blue Channel', img);
					test.pass(img instanceof Image);
				});
			});
		}],
		['getH/S/I', function (test) {
			g.ImageData(src, function (imd) {
				var h = imd.getH();
				h.getImage(function (img) {
					test.show('Hue Channel', img);
				});
				var s = imd.getS();
				s.getImage(function (img) {
					test.show('Saturation Channel', img);
				});
				var i = imd.getI();
				i.getImage(function (img) {
					test.show('Intensity Channel', img);
					test.pass(img instanceof Image);
				});
			});
		}],
		['getHSI', function (test) {
			g.ImageData(src, function (imd) {
				var hsi = imd.getHSI();
				hsi.getImage(function (img) {
					test.show('HSI Image', img);
					test.pass(img instanceof Image);
				});
			});
		}]
		);
});
