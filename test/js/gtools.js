//Test:gorgeous tools test
var g = gorgeous;
Test(['g.loadImage', function (test) {
	g.loadImage('img/baboon.png', function (img) {
		test.show('baboon.png', img);
		test.pass(img instanceof Image);
	});
}]);