+function() {
	'use strict';
	
	var app = angular.module('app', []);
	
	app.factory('NameFactory', nameFactory);
	
	nameFactory.$inject=['$http', '$timeout', '$q'];
	function nameFactory($http, $timeout, $q) {
		return {
			getName1: getName1,
			getName2: getName2,
			getName3: getName3,
			getComplex: getComplex
		};
		
		function getName1() {
			var dfd = $q.defer();
			setTimeout(function() {
				dfd.resolve({
					name: 'John Doe'
				});
			}, 1000);
			return dfd.promise;
		}
		
		function getName2() {
			return $timeout(function() {
				return { name: 'Jane Doe' };
			}, 1000);
		}
		
		function getName3() {
			return $http.get('/data/data.json')
				.then(function(res) {
					return res.data;
				});
		}
		
		function getComplex() {
			return $timeout(function() {
				return { firstName: 'Jimmy', lastName: 'Chandra' }
			}, 1000);
		}
	};

	app.controller('pageCtrl', pageCtrl);	
	pageCtrl.$inject = ['$log', '$q', 'NameFactory'];
	function pageCtrl($log, $q, NameFactory) {
		//jshint validthis: true
		var self = this;
		self.data1 = null;
		self.data2 = null;
		self.data3 = null;
		
		self.firstName = null;
		self.lastName = null;
		self.fullName = null;
		
		activate();
		
		function activate() {
			promise115Demo();
			//brokenChainDemo();
		}
		
		function promise115Demo() {
			self.data1 = NameFactory.getName1();
			$log.info(self.data);
			
			self.data2 = NameFactory.getName2();
			$log.info(self.data2);

			self.data3 = NameFactory.getName3();;
			$log.info(self.data3);
		}
		
		function brokenChainDemo() {
			fetchComplex();
			self.fullName = self.firstName + ' ' + self.lastName;
		}
		
		function fetchComplex() {
			NameFactory.getComplex()
				.then(bindComplex)
				.catch(handleFailure);
		}
		
		function bindComplex(data) {
			self.firstName = data.firstName;
			self.lastName = data.lastName;
		}
		
		function handleFailure() {
			alert('Unable to fetch complex data!');
		}
	}
}();