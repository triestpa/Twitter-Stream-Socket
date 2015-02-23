var twitterStream = angular.module('twitterStream', ['ui.router', 'ui.bootstrap']);

twitterStream.factory('socket', function ($rootScope) {
  var socket = io.connect();
  return {
    on: function (eventName, callback) {
      socket.on(eventName, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      });
    },
    emit: function (eventName, data, callback) {
      socket.emit(eventName, data, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      })
    }
  };
});

twitterStream.directive('header', function() {
	return {
		compile: function compile( tElement, tAttributes) {
			return {
				pre: function preLink(scope, element, attributes) {
					element.addClass('animated bounceInLeft')
				},
				post: function postLink( scope, element, attributes ) {
				}
			};
		}
	}
});

twitterStream.controller('MainCtrl', [
	'$scope', 'socket',
	function($scope, socket){
		$scope.tweets = [];
		var i = 0;
		socket.on('newTweet', function (tweet) {
		    $scope.tweets.push(tweet);
		});
	}
	]).config([
	'$stateProvider',
	'$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		$stateProvider
		.state('home', {
			url: '/home',
			templateUrl: '/home.html',
			controller: 'MainCtrl',
			data: {
            	css: 'styles/style.css'
          	}
		})
		$urlRouterProvider.otherwise('home');
	}]);

