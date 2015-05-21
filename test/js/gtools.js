//Test:gorgeous tools test
Test(['g.loadImage', function (test) {
	var g = gorgeous;
	g.loadImage('img/baboon.png', function (img) {
		test.show('baboon.png', img);
		test.pass(img instanceof Image);
	});
}]);