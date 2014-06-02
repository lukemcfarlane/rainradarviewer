app.controller('MainCtrl', function($scope, $http) {
	$http({
		method: 'GET',
		url: 'radar/images'
	}).
	success(function(data, status, headers, config) {
		$scope.status = 'Finished!';
		$scope.data = data;
		// this callback will be called asynchronously
		// when the response is available
	}).
	error(function(data, status, headers, config) {
		$scope.status = 'Error!';
		$scope.data = data;
		// called asynchronously if an error occurs
		// or server returns response with an error status.
	});
});