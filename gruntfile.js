module.exports = function(grunt) {
	grunt.initConfig({
		eslint: {
			target :['**/*.js']
		}
	});

	grunt.loadNpmTasks('grunt-contrib-jshint');

	grunt.registerTask('lint',['jshint']);
};