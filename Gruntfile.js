module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        separator: ';\n',
      },
      build: {
        src: [
          'src/gorgeous.js', 'src/ImageData.js', 'src/hsi.js', 'src/pixels.js', 'src/intensity.js',
          'src/histogram.js', 'src/filter.js', 'src/filters/blur.js', 'src/filters/sharpen.js',
          'src/filters/distort.js', 'src/Palette.js'
        ],
        dest: 'build/gorgeous.concat.js'
      },
      test: {
        src: [
          'src/gorgeous.js', 'src/ImageData.js', 'src/hsi.js', 'src/pixels.js', 'src/intensity.js',
          'src/histogram.js', 'src/filter.js', 'src/filters/blur.js', 'src/filters/sharpen.js',
          'src/filters/distort.js', 'src/Palette.js'
        ],
        dest: 'build/gorgeous.js'
      }
    },
    uglify: {
      options: {
        banner: '/*\n * <%= pkg.name %> v<%= pkg.version %> <%= grunt.template.today("yyyy-mm-dd") %>\n * author: chen-an@outlook.com \n */\n'
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