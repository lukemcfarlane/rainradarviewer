/**
 * This is the controller for index.html
 *
 * @author https: //github.com/lukemcfarlane
 * @date    June 2014
 */
app.controller('MainCtrl', function($scope, $http) {
	$scope.alerts = [];

	$http({
		method: 'GET',
		url: 'radar/images'
	}).
	success(function(data, status, headers, config) {
		loadImages(data);
	}).
	error(function(data, status, headers, config) {
		$scope.alerts.push('Something went wrong while trying to retrieve rain radar images.');
	});

	$scope.closeAlert = function(index) {
		$scope.alerts.splice(index, 1);
	};

	var loadImages = function(imagesArr) {
		angular.forEach(imagesArr, function(img) {
			img.active = false;
			img.time = moment
				.unix(img.datetime)
				.tz('Pacific/Auckland')
				.format('hh:mm a');
		});
		$scope.images = imagesArr;
	};
});