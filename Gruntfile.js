module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        separator: ';\n',
      },
      build: {
        src: ['src/gorgeous.js', 'src/tools.js', 'src/classes.js', 'src/arithmetic.js', 'src/hsi.js'
              , 'src/adjust.js', 'src/intensityTransformation.js'],
        dest: 'build/gorgeous.concat.js'
      },
      test: {
        src: ['src/gorgeous.js', 'src/classes.js', 'src/tools.js', 'src/arithmetic.js', 'src/hsi.js'
              , 'src/adjust.js', 'src/intensityTransformation.js'],
        dest: 'build/gorgeous.js'
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
        destPrefix: 'test/js/lib'
      },
      test: {
        files: {
          'gorgeous.js': 'gorgeous.js'
        }
      }
    },
    clean: ['build/gorgeous.concat.js']
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-npmcopy');

  grunt.registerTask('build', ['concat', 'uglify', 'clean']);
  grunt.registerTask('test', ['concat', 'npmcopy']);
  grunt.registerTask('default', 'build');

};