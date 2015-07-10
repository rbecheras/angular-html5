module.exports = function(grunt){

	require('load-grunt-tasks')(grunt);

	grunt.registerTask('default',['jshint','bump:patch', 'concat:dist']);
	grunt.registerTask('tag',['svn_tag']);
	
	grunt.initConfig({
		jshint: {
			'default': ['src/**/*.js']
		},		
		bump: {
			options: {
				files: ['package.json','bower.json'],
				updateConfigs: [],
				commit: false,
				createTag: false,
				push: false,
				globalReplace: false				
			}
		},	
		concat: {
			dist: {
				src: [
					'src/html5.js',
					'src/services/**.js'
				],
				dest: 'dist/sirap-html5.js'
			}
		},
		svn_tag: {
			options: {
				tag: '{%= version %}',
				commitMessage: 'auto-tag v.({%= version %})'
			}
		}			
	});

};
