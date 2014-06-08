/**
 * This is the controller for index.html
 *
 * @author https: //github.com/lukemcfarlane
 * @date    June 2014
 */
app.controller('MainCtrl', function($scope, $http) {
	$scope.alerts = [];
	$scope.numImages = 0;
	$scope.activeIndex = 0;
	$scope.images = [];

	$scope.$watch('activeIndex', function(newVal, oldVal) {
		_.each($scope.images, function(img) {
			img.active = false;
		});
		if (newVal < _.size($scope.images)) {
			$scope.images[newVal - 1].active = true;
		}
	});

	$http({
		method: 'GET',
		url: 'radar/images/'
	}).success(function(data, status, headers, config) {
		loadImages(data);
	}).error(function(data, status, headers, config) {
		$scope.alerts.push({
			msg: 'Something went wrong while trying to retrieve rain radar images.',
			type: 'danger'
		});
	});

	$scope.closeAlert = function(index) {
		$scope.alerts.splice(index, 1);
	};

	$scope.showImg = function(imgId) {
		_.each($scope.images, function(img) {
			img.active = false;
		});
		var img = _.findWhere($scope.images, {
			id: imgId
		});
		img.active = true;
	};

	var loadImages = function(imagesArr) {
		angular.forEach(imagesArr, function(img) {
			img.id = _.uniqueId('img_');
			img.active = false;
			img.label = moment
				.unix(img.datetime)
				.tz('Pacific/Auckland')
				.format('hh:mm a');
		});
		imagesArr = _.sortBy(imagesArr, 'datetime');

		_.last(imagesArr).active = true;
		$scope.images = imagesArr;
		$scope.numImages = _.size(imagesArr);
	};
});