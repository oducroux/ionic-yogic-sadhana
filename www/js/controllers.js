angular.module('starter.controllers', [])

.controller('AppCtrl', ['$scope', '$state', '$ionicModal', '$timeout', '$auth', '$rootScope', '$http', function($scope, $state, $ionicModal, $timeout, $auth, $rootScope, $http) {

  $scope.locale = "en";

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  $scope.loginForm = {};
  $scope.submitLogin = function() {
    $auth.submitLogin($scope.loginForm)
    .then(function(resp) {
      // console.log($auth.retrieveData('auth_headers'));
      $auth.authenticate('email')
        .then(function(){
          // console.log("Authenticated");
          $scope.closeLogin();
          // $state.go('app.courses');
        })
        .catch(function(){
          console.log("Authentication Failed !!");
        });
      // $scope.closeLogin();
    })
    .catch(function(resp) {
      // handle error response
    });
  };

  $rootScope.$on('auth:login-success', function(ev, user) {
    // alert('Welcome ', user.email);
    $state.go('app.courses');
  });
  $rootScope.$on('auth:validation-success', function() {
    $state.go('app.courses');
  });
  $rootScope.$on('auth:logout-success', function(ev) {
    // console.log('auth:logout-success');
    $state.go('sign_in');
  });

  $scope.signOut = function() {
    $auth.signOut();
  };

  $scope.reloadYs = function(){
    console.log("reloading");
    $http.get($auth.apiUrl() + '/' + $scope.locale + '/api/v1/courses').success(function(data){
      $scope.courses = data.courses;
      $scope.i18n_translations = data.i18n_translations;
    });
  };

  // Perform the login action when the user submits the login form
  // $scope.doLogin = function() {
  //   console.log('Doing login', $scope.loginData);
  //   $timeout(function() {
  //     $scope.closeLogin();
  //   }, 1000);
  // };
}])

.controller('PlaylistsCtrl', ['$scope', function($scope) {
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
}])

.controller('LoginController', ['$scope', '$auth', '$state', '$controller', function($scope, $auth, $state, $controller) {
  $controller('AppCtrl', {$scope: $scope});

  // var userCheck = $auth.validateUser();
  // if(userCheck.$$state.status == 1){
  //   $state.go('app.courses');
  // };

}])

.controller('PlaylistCtrl', ['$scope', '$stateParams', function($scope, $stateParams) {
}])

.controller('CoursesController', ['$scope', '$state', '$controller', 'Courses', function($scope, $state, $controller, Courses) {
  $controller('AppCtrl', {$scope: $scope});

  Courses.get($scope.locale, function(data){
    $scope.courses = data.courses;
    $scope.i18n_translations = data.i18n_translations;
  });

  // var userCheck = $auth.validateUser();
  // if(userCheck.$$state.status == 2){
  //   $state.go('sign_in');
  // };

}])

.controller('CourseController', ['$scope', '$stateParams', 'Course', '$controller', function($scope, $stateParams, Course, $controller){
  $controller('AppCtrl', {$scope: $scope});

  var course_id = $stateParams.courseId;
  Course.get($scope.locale, course_id, function(data){
    $scope.course = data.course;
    $scope.chapters = data.chapters;
    $scope.i18n_translations = data.i18n_translations;
  });

}])

.controller('ChapterController', ['$scope', 'Chapter', '$stateParams', '$controller', function($scope, Chapter, $stateParams, $controller){
  $controller('AppCtrl', {$scope: $scope});

  var chapter_id = $stateParams.chapterId;
  Chapter.get($scope.locale, chapter_id, function(data){
    $scope.chapter = data.chapter;
    $scope.theories = data.theories;
    $scope.practices = data.practices;
  });

}])

.controller('TheoriesController', ['$scope', '$stateParams', 'Theory', '$controller', function($scope, $stateParams, Theory, $controller){
  $controller('AppCtrl', {$scope: $scope});

  var theory_id = $stateParams.theoryId;
  Theory.get($scope.locale, theory_id, function(data){
    $scope.theories = data.theories;
    $scope.theory = data.theory;
    $scope.medias = data.medias;
  });

}])


.controller('TheoryMediaController', ['$scope', '$stateParams', 'GetTheoryMedia', '$controller', '$auth', function($scope, $stateParams, GetTheoryMedia, $controller, $auth){
  $controller('AppCtrl', {$scope: $scope});

  var media_id = $stateParams.mediaId;
  GetTheoryMedia.get($scope.locale, media_id, function(data){
    $scope.media = data.media;
  });

  $scope.getMediaUrl = function(path){
    return $auth.apiUrl() + path;
  };


}]);





