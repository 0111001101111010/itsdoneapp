angular.module('chat.controllers', ['services', 'angularPayments'])

.controller('ChatCtrl', function($scope, $stateParams, Auth) {
  console.log($stateParams.id);
  $scope.sayHello = function () {
    console.log("hello!");
  };
})
.controller('StagingCtrl', function($q, $scope, $stateParams, Request, $http) {
  var deferred = $q.defer();
  $scope.sayHello = function () {
    console.log("hello!");
  };
  $scope.details = '';
  getDetails();
  function getDetails(){$http.get(baseUrl+'api/products/'+$stateParams.id).success(function(response) {
    if(response) {
      $scope.details = response;
      console.log(response);
      // Create the items
      return deferred.resolve(response);
    } else {
      return deferred.resolve('No user found');
    }
    }).error(function(error) {
    //Fail our promise.
    deferred.reject(error);
  });
}
  // $scope.subscribe = function () {
  //   // body...
  // };
  $scope.handleStripe = function(status, response){
    console.log(response);
    alert('crud!');
    console.log(status);
        if(response.error) {
          // there was an error. Fix it.
          Request.post('api/products/subscribe',{"id": "545ff68506e64f0000f943cb", "user": Auth.currentUser()});
        } else {
          // got stripe token, now charge it or smt
          token = response.id;
        }
      };
})
.controller('AppCtrl', function($scope, $state, $filter, $stateParams, $q, $http, socket, Auth) {
  var deferred = $q.defer();
  var room = $stateParams.id;
  //Ensure they are authed first.
  if(Auth.currentUser() === null) {
    $state.go('login');
    return;
  }

  $scope.itsdone = function itsdone() {
    $state.go('payment');
  };
  $scope.Back = function () {
    $state.go('listings');
  };
  //input models
  $scope.draft = { message: '' };
  $scope.channel = { name: '' };

  //App info
  $scope.channels = [];
  $scope.listeningChannels = [];
  $scope.activeChannel = null;
  $scope.userName = Auth.currentUser().name;
  $scope.messages = [];


///////////////////////////////////////////////////
//Socket.io listeners
///////////////////////////////////////////////////


socket.on('channels', function channels(channels){
    console.log('channels', channels);

    console.log(channels);
    $scope.channels = channels;
    $scope.channels = channels;
  });

  socket.on('message:received', function messageReceived(message) {
    $scope.messages.push(message);
  });

  socket.emit('user:joined', {name: Auth.currentUser().name});

  socket.on('user:joined', function(user) {
    console.log('user:joined', user);
    $scope.messages.push(user);
  });

  $scope.listenChannel = function listenChannel (channel) {
    socket.on('messages:channel:' + channel, function messages(messages) {
      //console.log('got messages: ', messages);
      //console.log(messages.length);
      for(var i = 0, j = messages.length; i < j; i++) {
        var message = messages[i];
        console.log('message');
        console.log(message);
          console.log('apply with function');
        $scope.messages.push(message);
      }
    });

    socket.on('message:channel:' + channel, function message(message) {
      //console.log('got message: ' + message);
      if(channel != $scope.activeChannel) {
        return;
      }
      $scope.messages.push(message);
    });

    socket.on('message:remove:channel:' + channel, function(removalInfo) {
      console.log('removalInfo to remove: ', removalInfo);
      var expires = removalInfo.message.expires;
      var expireMessageIndex = $filter('messageByExpires')($scope.messages, expires);
      if(expireMessageIndex) {
        $scope.messages.splice(expireMessageIndex, 1);
      }

    });

    $scope.listeningChannels.push(channel);

  };


///////////////////////////////////////////////////////////////////////
// Controller methods
///////////////////////////////////////////////////////////////////////


  $scope.joinChannel = function joinChannel(channel) {
    $scope.activeChannel = channel;
    $scope.messages = [];

    $scope.channel.name = '';

    //Listen to channel if we dont have it already.
    if($scope.listeningChannels.indexOf(channel) == -1) {
      $scope.listenChannel(channel);
    }

    socket.emit('channel:join', { channel: channel, name: Auth.currentUser().name });
  };

  $scope.sendMessage = function sendMessage(draft) {
    if(!draft.message || draft.message === null || typeof draft === undefined || draft.length === 0) {
      return;
    }
    socket.emit('message:send', { message: draft.message, name: Auth.currentUser().name, channel: $scope.activeChannel });
    $scope.draft.message = '';
  };

	$scope.logout = function logout() {
		Auth.logout();
		$state.go('login');
	};

  //Data about the service
  $http.get(baseUrl+'api/products/'+ room ).success(function(response) {
    if(response) {
      $scope.item = response;
      console.log(response);
      return deferred.resolve(response);
    } else {
      return deferred.resolve('No user found');
    }
    }).error(function(error) {
    //Fail our promise.
    deferred.reject(error);
  });

  //Auto join the lobby
  $scope.joinChannel(room);
})
.controller('ListingCtrl', function($scope) {
  $scope.onControllerChanged = function(oldController, oldIndex, newController, newIndex) {
    console.log('Controller changed', oldController, oldIndex, newController, newIndex);
    console.log(arguments);
  };
});
