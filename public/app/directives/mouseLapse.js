/**
 * Usage:
 *
 *  <!-- Note: imageArr should be either an array of image src urls, or     -->
 *  <!-- data objects e.g. { url: 'images/myImg1.jpg, label: 'My Image 1' } -->
 *  <mouse-lapse images="imageArr"></mouse-lapse>
 *
 *
 * @author  https://github.com/lukemcfarlane
 * @date    June 2014
 */
app.directive('mouseLapse', function() {
	var DataTypeEnum = {
		OBJ: 0,
		URL: 1,
		EMPTY: 3
	};

	var makeActive = function(index, arr) {
		if (arr.length > 0) {
			for (var i = 0; i < arr.length; i++) {
				arr[i].active = false;
			}
			arr[index].active = true;
		}
	};

	var getDataType = function(dataArr) {
		var dataType;
		if (!isArray(dataArr)) {
			throw Error('Value for \'images\' mouse-lapse attribute must be an array');
		} else if (dataArr.length === 0) {
			dataType = DataTypeEnum.EMPTY;
		} else {
			var firstItem = dataArr[0];
			if (typeof firstItem === 'string') {
				dataType = DataTypeEnum.URL;
			} else if (typeof firstItem === 'object') {
				validateDataObj(firstItem);
				dataType = DataTypeEnum.OBJ;
			} else {
				var typeName = typeof firstItem;
				throw Error('Array of type \'' + typeName + '\' not supported for mouse-lapse attribute \'images\'');
			}
		}
		return dataType;
	};

	var validateDataObj = function(dataObj) {
		var isValid = true;
		if (!hasProperty(dataObj, 'url')) {
			throw Error('mouse-lapse data object must have property: \'url\'');
		}
		return isValid;
	};

	var isArray = function(obj) {
		return toString.call(obj) === '[object Array]';
	};

	var hasProperty = function(obj, key) {
		return obj != null && hasOwnProperty.call(obj, key);
	};

	var getDataFromUrlArr = function(imgUrlArr) {
		var imgDataArr = [];
		for (var i = 0; i < imgUrlArr.length; i++) {
			imgDataArr.push({
				index: i,
				url: imgUrlArr[i],
				active: false
			});
		}
		return imgDataArr;
	};

	var getDataFromObjArr = function(imgObjArr) {
		var imgDataArr = [];
		for (var i = 0; i < imgObjArr.length; i++) {
			var obj = imgObjArr[i];
			obj.index = i;
			obj.active = false;
			imgDataArr.push(obj);
		}
		return imgDataArr;
	};

	var getImgDataArr = function(images) {
		var imgDataArr;
		var dataType = getDataType(images);
		if (dataType === DataTypeEnum.URL) {
			imgDataArr = getDataFromUrlArr(images);
		} else if (dataType === DataTypeEnum.OBJ) {
			imgDataArr = getDataFromObjArr(images);
		} else if (dataType === DataTypeEnum.EMPTY) {
			imgDataArr = [];
		}
		return imgDataArr;
	};

	return {
		restrict: 'E',
		replace: true,
		scope: {
			images: '='
		},
		controller: function($scope, $element, $window) {
			var numCols = 0;
			var windowWidth = $window.innerWidth;
			$scope.$watch('images', function(newVal, oldVal) {
				$scope.imageDataArr = getImgDataArr(newVal);
				numCols = $scope.imageDataArr.length;
				makeActive(0, $scope.imageDataArr);
			});

			$element.on('mousemove', function($e) {
				if (typeof $scope.imageDataArr !== 'undefined') {
					var mouseX = $e.clientX;
					var col = Math.floor((mouseX / windowWidth) * numCols);
					makeActive(col, $scope.imageDataArr);
					$scope.$apply();
				}
			});
		},
		template: '<div class="ml-container" >' +
			'<div ng-repeat="img in imageDataArr" ng-show="img.active" class="ml-image-container">' +
			'<h4 ng-if="img.label">{{ img.label }}</h4>' +
			'<img ng-src="{{ img.url }}"></img>' +
			'</div>' +
			'</div>'
	};
});