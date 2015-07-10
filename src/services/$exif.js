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