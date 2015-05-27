'use strict';
const cp = require('child_process');
cp.exec(`g++ ${process.argv[2]} -o ${process.argv[2]}.exe`, function (err, stdout, stderr) {
  if (err) throw err;
  cp.exec(`${process.argv[2]}.exe ${process.argv.slice(3).join(' ')}`, function (error, stdout, stderr) {
    require('fs').unlink(`${process.argv[2]}.exe`);
    if (error) throw error;
    console.error(stderr);
    console.log(stdout);
  });
});