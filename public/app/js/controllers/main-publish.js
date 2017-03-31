'use strict';

/* Controllers */

angular.module('quizsApp')
.controller('MainPublishCtrl', ['$scope', '$state', '$stateParams', '$rootScope', 'Notifications', 'UsersApi', function($scope, $state, $stateParams, $rootScope, Notifications, UsersApi) {


	//on récupère les regroupements du profs
	UsersApi.regroupements({quiz_id: $stateParams.quiz_id}).$promise.then(function(response){
		if (!response.error) {
			if (response.regroupements_found.length == 0){
				Notifications.add("Vous n'avez aucun regroupement !", "warning");
			} else {
				$scope.regroupements = _.sortBy(response.regroupements_found, function(regroupement){
					return [regroupement.nameEtab, regroupement.name].join("_");
				});
				$rootScope.tmpPublishesRegroupements = angular.copy(_.where($scope.regroupements, {selected: true}));				
			}
		} else {
			Notifications.add("Impossible de récupérer vos regroupements !", "erreur");			
		};			
	});
	//fonction qui enregistre les modifications des publications et leur état.
	$scope.change = function(regroupement){
		if(regroupement.selected){
			$rootScope.tmpPublishesRegroupements = _.reject($rootScope.tmpPublishesRegroupements, function(tmpRgpt){
				return tmpRgpt.id === regroupement.id;
			});
			regroupement.selected = false;
		} else {
			$rootScope.tmpPublishesRegroupements.push(regroupement);
			regroupement.selected = true;
		};
	};
}]);