app.directive('mgOverlay', function() {
	return {
		restrict: 'E',
		scope: {
			activeCol: '=',
			numCols: '@'
		},
		controller: function($scope, $element, $window) {
			var windowWidth = $window.innerWidth;

			$element.on('mousemove', function($e) {
				$scope.activeCol = Math.floor(($e.clientX / windowWidth) * $scope.numCols) + 1;

				$scope.$apply();
			});
		},
		template: '<div class="mg-overlay" style="opacity: 0; position: absolute; z-index: 1000; width: 100%; height: 100%;"></div>'
	};
});