Test('Waterfall done correctly', function (test) {
	waterfall([
		function (callback) {
			setTimeout(function () {
				test.log('2000 ms');
				callback(null, 1000);
			}, 2000);
		},
		function (time, callback) {
			setTimeout(function () {
				test.log(time + ' ms');
				callback(null, 'hello,world', 1500);
			}, time);
		}
	], function (err, text, time) {
			if (err) {
				test.log(err);
			} else {
				setTimeout(function () {
					test.log(time + ' ms');
				}, time);
			}
	});
});

Test('Waterfall error', function (test) {
	waterfall([
		function (callback) {
			setTimeout(function () {
				test.log('2000 ms');
				callback(new Error('test error'));
			}, 2000);
		},
		function (time, callback) {
			setTimeout(function () {
				test.log(time + ' ms');
				callback(null, 'hello,world', 1500);
			}, time);
		}
	], function (err, text, time) {
			if (err) {
				test.log(err);
			} else {
				setTimeout(function () {
					test.log(time + ' ms');
				}, time);
			}
	});
});