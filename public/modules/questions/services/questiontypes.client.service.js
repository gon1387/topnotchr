'use strict';

//Questions service used to communicate Questions REST endpoints
angular.module('questions').factory('QuestionTypes', ['$resource',
	function($resource) {
		return $resource('questions/types');
	}
]);