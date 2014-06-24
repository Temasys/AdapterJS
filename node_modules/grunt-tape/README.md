# grunt-tape

Run tap/tape tests from within grunt

## Getting Started
This plugin requires Grunt.

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out
the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains
how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as
install and use Grunt plugins. Once you're familiar with that process, you may
install this plugin with this command:

```shell
npm install grunt-tape --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile
with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-tape');
```

## The "tape" task

### Overview
In your project's Gruntfile, add a section named `tape` to the data object
passed into `grunt.initConfig()`.

``` js
module.exports = function (grunt) {
  grunt.initConfig({
    tape: {
      options: {
        pretty: true
        output: 'console'
      },
      files: ['test/**/*.js']
    }
  });
  grunt.loadNpmTasks('grunt-tape');
  grunt.registerTask('test', ['tape:pretty']);
  grunt.registerTask('ci', ['tape:ci']);
  grunt.registerTask('default', ['test']);
};
```

### Options

#### options.pretty
Type: `Boolean`
Default value: `true`

When true, the TAP output will be output through
[faucet](https://github.com/substack/faucet) and pretty printed to the console.

#### options.output
Type: `String`
Default value: `console`

Outputs the TAP output to `stdout` if the output is `'console'`.
Outputs the TAP output to `options.file` if the output is `file''`.

#### options.file
Type: `String`

When `options.output` is `'file'`, then this will be the file location that
the TAP output gets written to.

### Usage Examples

#### Default Options
In this example, the default options are used to run tests in `tests/*.js`

```js
grunt.initConfig({
  tape: {
    options: {},
    files: ['tests/*.js']
  }
})
```

#### Turn off pretty printing and just ouput raw TAP output to stdout
In this example, we write TAP to stdout:

```js
grunt.initConfig({
  tape: {
    options: {
      pretty: false
    },
    files: ['tests/*.js']
  }
})
```

#### Save to file
In this example, custom options are used to write the output to a file:

```js
grunt.initConfig({
  tape: {
    options: {
      output: 'file',
      file: './output.tap'
    },
    files: ['tests/*.js']
  }
})
```
