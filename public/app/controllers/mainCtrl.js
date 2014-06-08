/**
 * This is the controller for index.html
 *
 * @author https: //github.com/lukemcfarlane
 * @date    June 2014
 */
app.controller('MainCtrl', function($scope, $http, $interval) {
	$scope.alerts = [];
	$scope.numImages = 0;
	$scope.activeIndex = 0;
	$scope.images = [];
	$scope.isUpdating = false;

	var lastUpdatedTime = null;

	$scope.lastUpdatedStr = '';


	$scope.$watch('activeIndex', function(newVal, oldVal) {
		_.each($scope.images, function(img) {
			img.active = false;
		});
		if (newVal < _.size($scope.images)) {
			$scope.images[newVal - 1].active = true;
		}
	});

	var getNewImages = function() {
		console.log('updating...');
		$scope.isUpdating = true;
		var endpoint;
		if (lastUpdatedTime === null) {
			endpoint = 'radar/images';
		} else {
			var since = parseInt(moment().format('X')) - ((new Date()).getTimezoneOffset() * 60); // ekkk... fix this soon!
			endpoint = 'radar/images?since=' + since;
		}
		$http({
			method: 'GET',
			url: endpoint
		}).success(function(data, status, headers, config) {
			if (_.size(data) > 0) {
				loadImages(data);
				lastUpdatedTime = moment();
			}
			updateLastUpdatedStr();
			$scope.isUpdating = false;
		}).error(function(data, status, headers, config) {
			$scope.alerts.push({
				msg: 'Something went wrong while trying to retrieve rain radar images.',
				type: 'danger'
			});
			$scope.isUpdating = false;
		});
	};

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

	getNewImages();
	$interval(getNewImages, 30 * 1000); // check for new data every 30 seconds

	var updateLastUpdatedStr = function() {
		if (lastUpdatedTime !== null) {
			$scope.lastUpdatedStr = moment.duration(lastUpdatedTime.diff(moment())).humanize();
		}
	};
	$interval(updateLastUpdatedStr, 5 * 1000);

	var getCurrentTime = function() {
		return Math.round(new Date().getTime() / 1000);
	};

	var loadImages = function(imagesArr) {
		console.log('Loading ' + imagesArr.length + ' new images...');
		angular.forEach(imagesArr, function(img) {
			img.id = _.uniqueId('img_');
			img.active = false;
			img.label = moment
				.unix(img.datetime)
				.tz('Pacific/Auckland')
				.format('hh:mm a');
			img.retrievedAt = getCurrentTime();
		});
		imagesArr = _.sortBy(imagesArr, 'datetime');

		_.last(imagesArr).active = true;
		$scope.images = imagesArr;
		$scope.numImages = _.size(imagesArr);
	};
});