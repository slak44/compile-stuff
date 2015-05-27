'use strict';
const cp = require('child_process');
cp.exec(`javac ${process.argv[2]}`, function (err, stdout, stderr) {
  if (err) throw err;
  cp.exec(`java ${process.argv[2].slice(0, -5)} ${process.argv.slice(3).join(' ')}`, function (error, stdout, stderr) {
    require('fs').unlink(`${process.argv[2].slice(0, -5)}.class`);
    if (error) throw error;
    console.error(stderr);
    console.log(stdout);
  });
});