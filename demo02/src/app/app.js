+function() {
	'use strict';
	
	var app = angular.module('app', []);
	
	app.factory('HeroFactory', HeroFactory);
	
	HeroFactory.$inject=['$http', '$timeout', '$q', '$log'];
	function HeroFactory($http, $timeout, $q, $log) {
		return {
			getUsingQ: getUsingQ,
			getUsingTimeout: getUsingTimeout,
			getUsingHttp: getUsingHttp
		};
		
		function getUsingQ() {
			var dfd = $q.defer();
			setTimeout(function() {
				dfd.resolve({
					name: 'Superman'
				});
			}, 1000);
			return dfd.promise;
		}
		
		function getUsingTimeout() {
			return $timeout(function() {
				return { name: 'Spiderman' };
			}, 1000);
		}
		
		function getUsingHttp() {
			return $http.get('/data/data.json')
				.then(getSuccess)
				.catch(getFailure);
				
			function getSuccess(res) {
				return res.data;
			}
			
			function getFailure(res) {
				$log.error(res);
				return $q.reject('Unable to fetch from file.');
			}
		}
	};

	app.controller('pageCtrl', pageCtrl);	
	pageCtrl.$inject = ['$log', '$q', 'HeroFactory'];
	function pageCtrl($log, $q, HeroFactory) {
		//jshint validthis: true
		var self = this;
		self.hero1 = null;
		self.hero2 = null;
		self.hero3 = null;
		self.message = '';
		
		activate();
		
		function activate() {
			serialChainDemo();
			//parallelChainDemo();
		}
				
		function serialChainDemo() {
			fetchHero1()
				.then(bindHero1)
				.then(fetchHero2)
				.then(bindHero2)
				.then(fetchHero3)
				.then(bindHero3)
				.catch(handleProblem)
				.finally(clearMessage);
		}
		
		function fetchHero1() {
			self.message = 'Fetching Hero 1...';
			return HeroFactory.getUsingQ()
		}
		
		function bindHero1(name) {
			self.hero1 = name;
			return $q.when(true);
		}
		
		function fetchHero2() {
			self.message = 'Fetching Hero 2...';
			return HeroFactory.getUsingTimeout();
		}
		
		function bindHero2(name) {
			self.hero2 = name;
			return $q.when(true);
		}
		
		function fetchHero3() {
			self.message = 'Fetching Hero 3...';
			return HeroFactory.getUsingHttp();
		}
		
		function bindHero3(name) {
			self.hero3 = name;
			return $q.when(true);
		}
		
		function clearMessage() {
			self.message = '';
		}
		
		function parallelChainDemo() {
			self.message = 'Fetching all heroes at the same time...';
			var fetchTasks = [
				HeroFactory.getUsingQ(),
				HeroFactory.getUsingTimeout(),
				HeroFactory.getUsingHttp()
			];
			 
			$q.all(fetchTasks)
				.then(bindAllHeroes)
				.catch(handleProblem)
				.finally(clearMessage);
		}
		
		function bindAllHeroes(results) {
			var dfd = $q.defer();
			self.message = 'All heroes fetched...';
			$log.info(results);
			self.hero1 = results[0];
			self.hero2 = results[1];
			self.hero3 = results[2];
			dfd.resolve(true);
			return dfd.promise;
			
			//return $q.when(true);
		}
		
		function handleProblem(reason) {
			alert('Unable to fetch one or more heroes.\n' + reason);
		}
	}
}();