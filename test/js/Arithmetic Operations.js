//Test:Arithmetic Operations Test
var g = gorgeous;
var src = 'img/baboon.png';
var canvas1 = document.createElement('canvas');
var ctx1 = canvas1.getContext('2d');
var canvas2 = document.createElement('canvas');
var ctx2 = canvas2.getContext('2d');
var img = g.loadImage(src, function (img) {
	canvas1.width = 120;
	canvas1.height = 120;
	ctx1.fillStyle = 'rgb(225, 10, 101)';
	ctx1.fillRect(0, 0, 120, 120);
	canvas2.width = 120;
	canvas2.height = 120;
	ctx2.fillStyle = 'rgb(0, 21, 190)';
	ctx2.fillRect(0, 0, 120, 120);
	tests();
});

function tests() {
Test(
	['Add Operation', function (test) {
		var imd1 = g.ImageData(canvas1);
		var imd2 = g.ImageData(canvas2);
		var rimd = imd2.add(imd1);
		rimd.getImage(function (img) {
			test.show('Sum Image', img);
			test.pass(function () {
				var ps = rimd.getPixels();
				return ps.every(function (p) {
					if (p.r !== 225 || p.g !== 31 || p.b !== 255) {
						return false;
					}
					return true;
				});
			});
		});
	}],
	['Subtract Operation', function (test) {
		var imd1 = g.ImageData(canvas1);
		var imd2 = g.ImageData(canvas2);
		var rimd = imd2.sub(imd1);
		rimd.getImage(function (img) {
			test.show('Diff Image', img);
			test.pass(function () {
				var ps = rimd.getPixels();
				return ps.every(function (p) {
					if (p.r !== 0 || p.g !== 11 || p.b !== 89) {
						return false;
					}
					return true;
				});
			});
		});
	}],
	['Multiply Operation', function (test) {
		var imd1 = g.ImageData(canvas1);
		var imd2 = g.ImageData(canvas2);
		var rimd = imd2.mul(imd1);
		rimd.getImage(function (img) {
			test.show('Product Image', img);
			test.pass(function () {
				var ps = rimd.getPixels();
				return ps.every(function (p) {
					if (p.r !== 0 || p.g !== 210 || p.b !== 255) {
						return false;
					}
					return true;
				});
			});
		});
	}],
	['Divide Operation', function (test) {
		var imd1 = g.ImageData(canvas1);
		var imd2 = g.ImageData(canvas2);
		var rimd = imd2.div(imd1);
		rimd.getImage(function (img) {
			test.show('Quotient Image', img);
			test.pass(function () {
				var ps = rimd.getPixels();
				return ps.every(function (p) {
					if (p.r !== 0 || p.g !== 2 || p.b !== 2) {
						return false;
					}
					return true;
				});
			});
		});
	}]
);
}