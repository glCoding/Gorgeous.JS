//Test:Histogram Operations Test
var g = gorgeous;

var src = 'img/baboon.png';
var tip = document.createElement('h3');
tip.innerHTML = 'Loading baboon image, please wait...';
document.body.appendChild(tip);
g.loadImage(src, function (img) {
	tip.innerHTML = 'Baboon image loaded.';
	Test(
		['Histogram Euqalization', function (test) {
			var imd = g.ImageData(img);
			imd.getImage(function (img) {
				test.show('origin', img);
			});
			imd.equalize().getImage(function (img) {
				test.show('histogram equalized', img);
				test.pass(img instanceof Image);
			});
		}]
		);
});
