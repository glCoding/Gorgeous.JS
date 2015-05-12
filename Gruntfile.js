module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        separator: ';\n',
      },
      build: {
        src: ['src/gorgeous.js', 'src/constructors.js', 'src/tools.js'],
        dest: 'build/gorgeous.concat.js'
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> v<%= pkg.version %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        files: {
          'build/gorgeous.min.js': ['build/gorgeous.concat.js'],
        }
      }
    },
    npmcopy: {
      options: {
        srcPrefix: 'build',
        destPrefix: 'test/js'
      },
      build: {
        files: {
          'gorgeous.min.js': 'gorgeous.min.js'
        }
      }
    },
    clean: ['build/gorgeous.concat.js']
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-npmcopy');

  grunt.registerTask('build', ['concat', 'uglify', 'clean', 'npmcopy']);
  grunt.registerTask('default', 'build');

};