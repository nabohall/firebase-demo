// Create application with dependency 'firebase'
var app=angular.module("tweetApp", ['firebase']);

// Bind controller, passing in $scope, $firebaseAuth, $firebaseArray, $firebaseObject
app.controller('tweetCtrl', function($scope,$firebaseAuth,$firebaseArray,$firebaseObject){
	// Create a variable 'ref' to reference your firebase storage
	var dbRef = new Firebase("https://introduce.firebaseio.com")

    // Create references to store tweets and users
    var tweetRef = dbRef.child('tweets')
    var usersRef = dbRef.child('users');

    // Create a firebaseArray of your tweets, and store this as part of $scope
    $scope.tweetArr = $firebaseArray(tweetRef);
    

    // Create a firebaseObject of your users, and store this as part of $scope
    $scope.usersOb = $firebaseObject(usersRef);

    // Create authorization object that referes to firebase
	$scope.authObj = $firebaseAuth(dbRef);

	/* 
		-- Insert authentication code here
    */
	// Test if already logged in
	var authData = $scope.authObj.$getAuth();
	if (authData) {
		$scope.userId = authData.uid;
	} 

	// SignUp function
	$scope.signUp = function() {
		// Create user
		$scope.authObj.$createUser({
			email: $scope.email,
			password: $scope.password, 			
		})

		// Once the user is created, call the logIn function
		.then($scope.logIn)

		// Once logged in, set and save the user data
		.then(function(authData) {
			$scope.userId = authData.uid;
			$scope.usersOb[authData.uid] ={
				handle:$scope.handle, 
				userImage:$scope.userImage,
			}
			$scope.usersOb.$save()
		})

		// Catch any errors
		.catch(function(error) {
			console.error("Error: ", error);
		});
	}

	// SignIn function
	$scope.signIn = function() {
		$scope.logIn().then(function(authData){
			$scope.userId = authData.uid;
		})
	}

	// LogIn function
	$scope.logIn = function() {
		return $scope.authObj.$authWithPassword({
			email: $scope.email,
			password: $scope.password
		})
	}

	// LogOut function
	$scope.logOut = function() {
		$scope.authObj.$unauth()
		$scope.userId = false
	}

	// Write an accesible tweet function to save a tweet
		
		/* Add a new object to the tweets array using the firebaseArray .$add method. Inclue:
			text:text in textarea,
			userId:current user id,
			likes:0,
			time:Firebase.ServerValue.TIMESTAMP // tells firebase server to save timestamp
		*/

	$scope.tweet = function(){
		$scope.tweetArr.$add({
			text:$scope.newTweet,
			userId:$scope.userId,
			likes:0,
			time:Firebase.ServerValue.TIMESTAMP
		}).then(function(){
			$scope.newTweet = "";
		})
	};		

	$scope.like = function(tweet){
		tweet.likes++;
		$scope.tweets.$save(tweet);
	}

});
   
	
	
		

		// Once the tweet is saved, reset the value of $scope.newTweet to empty string


	// Function to like a tweet 
	

