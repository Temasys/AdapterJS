/*
 * grunt-tape
 * https://github.com/eugeneware/grunt-tape
 *
 * Copyright (c) 2014 Eugene Ware
 * Licensed under the BSD-3-Clause license.
 */

'use strict';

var path = require('path'),
    fs = require('fs'),
    spawn = require('child_process').spawn,
    faucet = require('faucet'),
    through = require('through');

module.exports = function (grunt) {
  grunt.registerMultiTask('tape', 'Run tap/tape tests from within grunt', function () {
    var done = this.async();

    var options = this.options({
      pretty: true,
      output: 'console'
    });

    var tapeRunner = require.resolve('tape/bin/tape');
    var runner = spawn(tapeRunner, this.filesSrc);
    var format = options.pretty ? faucet() : through();
    runner.stderr.pipe(process.stderr, { end: false });

    var file = false;
    if (options.output === 'file' && options.file) {
      var outFile = path.resolve(process.cwd(), options.file);
      file = true;
      runner.stdout.pipe(fs.createWriteStream(outFile));
    } else  {
      runner.stdout.pipe(format).pipe(process.stdout, { end: false });
    }

    runner.on('close', function (code) {
      if (file) {
        grunt.log.writeln('TAP output written to: ' + options.file);
      }
      if (code !== 0) {
        done(new Error('TAP test failure. Exited with code ' + code));
      } else {
        done();
      }
    });
  });
};
