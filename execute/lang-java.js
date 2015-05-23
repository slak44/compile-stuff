'use strict';
const cp = require('child_process');
cp.exec(`javac ${process.argv[2]}`, function (err, stdout, stderr) {
  if (err) throw err;
  cp.exec(`java ${process.argv[2].slice(0, -5)}`, function (error, stdout, stderr) {
    if (error) throw error;
    console.log(stdout);
    require('fs').unlink(`${process.argv[2].slice(0, -5)}.class`);
  });
});