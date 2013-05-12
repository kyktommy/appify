module.exports = function(grunt) {
  grunt.initConfig({
   jshint: {
      files: ['src/app.js']
   }, 

   mocha: {
     all: {
       src: ['test/index.html'],
       options: {
         run: true
       }
     }
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
  grunt.loadNpmTasks('grunt-mocha');

  grunt.task.registerTask('default', ['jshint', 'mocha', 'uglify']);
}
