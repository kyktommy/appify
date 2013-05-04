module.exports = function(grunt) {
  grunt.initConfig({
   jshint: {
      files: ['src/app.js']
   }, 

   mocha_phantomjs: {
     all: ['test/**/*.html']
   },

   uglify: {
     build: {
       src: 'src/app.js',
       dest: 'build/app.min.js'
     }
   }
 });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-mocha-phantomjs');

  grunt.task.registerTask('default', ['jshint', 'mocha_phantomjs', 'uglify']);
}
