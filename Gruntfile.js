/*
  backbone.paginator
  http://github.com/surikoya/presenation

  Copyright (c) 2015 Suresh Koya<sbabu@vmtechllc.com>
  Licensed under the MIT license.
*/


"use strict";

module.exports = function (grunt) {

  grunt.initConfig({

    pkg: grunt.file.readJSON("package.json"),

    clean: {
      options: {
        force: true
      },
      api: [
        "api/**/*"
      ]
    },
    jsdoc: {
      dist: {
        src: ["js/app.js"],
        dest: "api"
      }
    }
  });
  grunt.loadNpmTasks("grunt-contrib-clean");
  grunt.loadNpmTasks('grunt-jsdoc');

  grunt.registerTask("default", ["clean",  "jsdoc"]);
};
