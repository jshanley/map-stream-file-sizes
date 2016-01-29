var through = require('through2');
var StreamCounter = require('stream-counter');
var gutil = require('gulp-util');
var chalk = require('chalk');
var path = require('path');

module.exports = function(config) {
  return through.obj(function (file, enc, cb) {
    var output = function (err, size) {
      if (err) {
        cb(new gutil.PluginError('map-stream-file-sizes', err));
        return;
      }
      var pathString = path.relative(__dirname, file.path)
      console.log(chalk.blue(pathString), chalk.yellow(size));

      cb(null, file);
    };
    if (file.isNull()) {
      cb(null, file);
      return;
    }
    if (file.isStream()) {

      file.contents.pipe(new StreamCounter())
        .on('error', output)
        .on('finish', function () {
          output(null, this.bytes);
        });

      return;
    }
    output(null, file.contents.length);
  })
}
