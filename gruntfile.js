module.exports = function(grunt) {

require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    watch: {
		 	compass: {
	    	files: ['./public/sass/*.sass'],
	    	tasks: ['compass:dev']
	    },
      browserify: {
        files: ['./public/src/*.js', './public/data/*.json'],
        tasks: ['browserify', 'babel']
      }
		},
    browserify: {
      client: {
        src: ['public/src/party.js'],
        dest: 'public/party.js'
      }
    },
    babel: {
      options: {
        sourceMap: true
      },
      dist: {
        files: {
          'public/main.js': 'public/party.js'
        }
      }
    },
   	compass: {
	    dev: {
        options: {
          sassDir: ['public/sass'],
          cssDir: ['public/css'],
		  		environment: 'development'
				}
	    },
      prod: {
        options: {
          sassDir: ['public/sass'],
          cssDir: ['public/css'],
		  		environment: 'production'
		  	}
      },
    }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-browserify');

  grunt.registerTask('default', ['watch']);

};
