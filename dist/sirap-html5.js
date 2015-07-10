(function(){

angular.module('sirap-html5',[]);

})();


/**
 * dataURItoBlob() convert base64/URLEncoded data component to raw binary data held in a string
 * @param dataURI String Base64 Data URI string
 * @return Blob Raw binary data object
 */
function dataURItoBlob(dataURI) {
    var byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0)
        byteString = atob(dataURI.split(',')[1]);
    else
        byteString = unescape(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to a typed array
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ia], {type:mimeString});
}
(function () {

angular.module('sirap-html5')
.factory('$exif', [
	'$timeout',
	'$q',
function($timeout, $q){

	// Check that the browser supports the FileReader API.
	if (!window.FileReader) {
		alert('Sorry, your web browser does not support the FileReader API.');
		return;
	}
	var handleFile = function (file) {
		
		alert('handling file for exif on a ' + file + ' value.');

		var reader = new FileReader();
		reader.onload = function (evt) {
			alert('onloadend');
			alert(JSON.stringify(evt));
			alert("reader onload evt: " + JSON.stringify(evt));
			try {
				var exif = new ExifReader();
				alert('type of ExifReader instance: ' + typeof exif);

				exif.load(evt.target.result);

				// Or, with jDataView you would use this:
				// exif.loadView(new jDataView(evt.target.result));

				var tags = exif.getAllTags();
				alert(JSON.stringify(tags));
			}
			catch (error) {
				alert(error);
			}
		};
		reader.onloadend = function(evt){
			alert('onloadend');
			alert(JSON.stringify(evt));
		};
		reader.onloadstart = function(evt){
			alert('onloadstart evt');
			alert(JSON.stringify(evt));
		};
		reader.onabort = function(evt){
			alert('onabort evt');
			alert(JSON.stringify(evt));
		};
		reader.onerror = function(evt){
			alert('onerror');
			alert(JSON.stringify(evt));
		};
		alert('debug reader: ' + JSON.stringify(reader));
		try	{
			alert('reading file as array readAsArrayBuffer');
			reader.readAsArrayBuffer(file);
			//reader.readAsDataURL(file);

			$timeout(function(){
				alert('debug reader: ' + JSON.stringify(reader));
				alert('debug reader: ' + JSON.stringify(reader.error));
			},3000);
		} catch (e) {
			alert('error while reading as array buffer: ' + e);
		}
	};
	var getFile = function(path){

		var defer = $q.defer();

	    var request = new XMLHttpRequest();
	    request.onreadystatechange = function (){
	    	BlobBuilder = window.MozBlobBuilder || window.WebKitBlobBuilder || window.BlobBuilder;
	        if(request.readyState === 4){
	            if(request.status === 200 || request.status === 0){
	            	try {
		                var blob = new BlobBuilder();
		                blob.append(request.response);
		                var file = new File(blob.getBlob('image/jpeg'));
		                $q.resolve(file);
	            	} catch(e){
	            		$q.reject(e);
	            	}
	            } else {
	            	$q.reject('status: ' + request.status);
	            }
	        } else {
	        	$q.reject('readyState: ' + request.readyState);
	        }
	    };
	    request.open("GET", path, false);
		request.responseType = "arraybuffer";	    
	    request.send(null);

	    return $q.promise;
	};
	
	return {
		test: function(filepath){
			getFile(filepath).then(function(file){
				alert('type of the file to handle is: ' + typeof file);
				handleFile(file);
			}, function(e){
				alert('error >>' + e);
			});
		}
	};
}]);
})();
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