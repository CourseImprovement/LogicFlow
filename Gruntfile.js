module.exports = function(grunt) {

  grunt.initConfig({
    concat: {
      js: {
        src: ['src/init.js', 'src/*.js', 'src/*/*.js', 'src/*/*/*.js'],
        dest: 'build/ProgramNode.js'
      },
      css: {
        src: ['src/*.css', 'src/*/*.css', 'src/*/*/*.css'],
        dest: 'build/ProgramNode.css'
      }
    },
    watch: {
      files: ['src/*.js', 'src/*/*.js', 'src/*/*/*.js', 'src/*.css', 'src/*/*.css', 'src/*/*/*.css'],
      tasks: ['w'],
      options: {
        reload: true
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['w', 'watch']);
  grunt.registerTask('w', ['concat']);
};