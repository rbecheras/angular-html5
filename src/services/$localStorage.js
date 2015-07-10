(function(){
'use strict';

angular.module('sirap-html5').factory('$localStorage', ['$window',$localStorage]);

function $localStorage($window) {

    var localStorage = {};

    localStorage.set = function(key, value) {
        $window.localStorage[key] = value;
    };
    localStorage.get = function(key, defaultValue) {
        return $window.localStorage[key] || defaultValue;
    };
    localStorage.setObject = function(key, value) {
        $window.localStorage[key] = JSON.stringify(value);
    };
    localStorage.getObject = function(key) {
        return (!$window.localStorage[key] || $window.localStorage[key] === undefined) ? {} : JSON.parse($window.localStorage[key]);
    };
    localStorage.setArray = function(key, array){
        if (!array.length) {
            console.debug(array);
            $window.localStorage[key] = '[]';
        } else{
            this.setObject(key, array);                    
        }
    };
    localStorage.getArray = function(key){
        return (!$window.localStorage[key] || $window.localStorage[key] === undefined) ? [] : JSON.parse($window.localStorage[key]);
    };
    /**
     * public save()
     * Sauvegarde des infos en mémoire dans localstorage dans un fichier sur le système.
     * @param string key un ientifiant de localstorage
     * @param filename
     * @return void
     * 
     * ATTENTION
     * Fonctionne sur chrome, mais ne fonctionne pas sur cordova.
     *      CF. solution derriere le lien ci-dessous
     *      http://www.raymondcamden.com/2014/11/05/Cordova-Example-Writing-to-a-file
     */
    localStorage.save = function(key, fileName){        
        var data = [$window.localStorage[key]] || ['{}'];
        var blob = new Blob(data,{type:'application/json;charset=utf-8'});
        $window.saveAs(blob,fileName);
    };
    return localStorage;

    
}
angular.module('sirap-html5').directive('fileSelect', [ fileSelect ]);


function fileSelect() { 
    return {
        scope: {
            onSelect: '='
        },
        link: function(scope, element, attr) {
            element.bind("change", function (changeEvent) {
                scope.$apply(function () {
                    console.log('fileSelect changeEvent: ', changeEvent);
                    scope.onSelect(changeEvent.target.files[0]);
                    // or all selected files:
                    // changeEvent.target.files;
                });
            });            
        }
    };
}
})();