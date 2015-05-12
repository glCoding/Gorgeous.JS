module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        separator: ';\n',
      },
      build: {
        src: ['src/gonzalez.js', 'src/constructors.js', 'src/tools.js'],
        dest: 'build/gonzalez.concat.js'
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> v<%= pkg.version %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        files: {
          'build/gonzalez.min.js': ['build/gonzalez.concat.js'],
        }
      }
    },
    npmcopy: {
      options: {
        srcPrefix: 'build',
        destPrefix: 'test/js'
      },
      test: {
        files: {
          'gonzalez.min.js': 'gonzalez.min.js'
        }
      }
    },
    clean: ['build/gonzalez.concat.js']
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-npmcopy');

  grunt.registerTask('build', ['concat', 'uglify', 'clean']);
  grunt.registerTask('test', ['build', 'npmcopy']);
  grunt.registerTask('default', ['test']);

};