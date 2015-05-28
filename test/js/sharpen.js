//Test:Sharpen Test
var g = gorgeous;

var src = 'img/baboon.png';
var tip = document.createElement('h3');
tip.innerHTML = 'Loading baboon image, please wait...';
document.body.appendChild(tip);
g.loadImage(src, function (img) {
	tip.innerHTML = 'Baboon image loaded.';
	Test(
		['Sharpen', function (test) {
			var imd = new g.ImageData(img);
			imd.getImage(function (img) {
				test.show('Original Image', img);
			});
			console.time('use kernel');
			var filter = 'Sharpen';
			imd.use(filter).getImage(function (img) {
				test.show(filter, img);
				test.pass(img instanceof Image);
			});
			console.timeEnd('use kernel');
		}],
		['Excessive Sharpen', function (test) {
			var imd = new g.ImageData(img);
			imd.getImage(function (img) {
				test.show('Original Image', img);
			});
			console.time('use kernel');
			var filter = 'Excessive Sharpen';
			imd.use(filter).getImage(function (img) {
				test.show(filter, img);
				test.pass(img instanceof Image);
			});
			console.timeEnd('use kernel');
		}],
		['Emboss & Gray', function (test) {
			var imd = new g.ImageData(img);
			imd.getImage(function (img) {
				test.show('Original Image', img);
			});
			console.time('use kernel');
			g.register('Gray Emboss', ['Emboss'], ['gray']);
			var filter = 'Gray Emboss';
			imd.use(filter).getImage(function (img) {
				test.show(filter + ' & Gray', img);
				test.pass(img instanceof Image);
			});
			console.timeEnd('use kernel');
		}]
		);
});