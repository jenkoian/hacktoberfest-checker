module.exports =function(grunt) {
	grunt.initConfig({
		jshint: {
			all :['index.js','public/js/*.js']
		}
	});

	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.registerTask('lint',['jshint']);
};