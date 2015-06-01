(function (g) {

	g.register('Sharpen', [
		-1, -1, -1,
		-1, 9, -1,
		-1, -1, -1
	], 3, 3);

	g.register('Excessive Sharpen', [
		1, 1, 1,
		1, -7, 1,
		1, 1, 1
	], 3, 3);

} (gorgeous));