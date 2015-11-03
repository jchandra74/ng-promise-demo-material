+function() {
	'use strict';
	
	angular.module('app',[]);
	
	angular.module('app')
		.factory('DataFactory', DataFactory);
		
	DataFactory.$inject = ['$log', '$q', '$timeout'];
	function DataFactory($log, $q, $timeout) {
		var data = [
			'Data 1',
			'Data 2',
			'Data 3',
			'Data 4',
			'Data 5'	
		], loaded = 0;
		
		return {
			getData: getData,
			doSomething: doSomething
		};
		
		function getData() {
			var dfd = $q.defer(),
				fetchedData = [];

			loaded = 0;
			fetchData();
			
			function fetchData() {
				fetchedData.push(data[loaded]);
				loaded++;
				if (loaded < data.length) {
					dfd.notify({ loaded: loaded, total: data.length});
					setTimeout(fetchData, 1000);
				} else {
					dfd.notify({ loaded: loaded, total: data.length});
					dfd.resolve(fetchedData);
				}
			}
			
			return dfd.promise;	
		}
		
		function doSomething() {
			return $timeout(function() {
				throw "KABOOM!";
			}, 1000)
			.then(function(res) {
				return "OK";
			})
			.catch(function(res) {
				return res;	//WRONG!!
			});
		}
	}
	
	angular.module('app')
		.controller('pageCtrl', pageCtrl);
	
	pageCtrl.$inject = ['$log', 'DataFactory'];
	function pageCtrl($log, DataFactory) {
		//jshint validthis: true
		var self = this;
		self.startFetch = startFetch;
		self.loading = false;
		self.loadProgress = '0%';
		self.data = [];
		
		activate();
		
		function activate() {
			DataFactory.doSomething()
				.then(function(data) {
					$log.info('Should not be here!')
				})
				.catch(function(reason) {
					$log.info('Should be here.');
				})
		}
		
		function startFetch() {
			$log.info('Fetching data...');
			self.loading = true;
			self.loadProgress = '0%';
			self.data = [];
			DataFactory
				.getData()
				.then(bindData, handleProblem, notifyProgress);
		}
		
		function notifyProgress(status) {
			$log.info(status);
			self.loadProgress = (status.loaded / status.total * 100) + '%';
		}
		
		function bindData(data) {
			$log.info(data);
			self.loading = false;
			self.data = data;
		}
		
		function handleProblem(reason) {
			alert('Houston, we have a problem!');
		}
	}
	
	
  angular
    .bootstrap(document.body, ['app']);
}();