'use strict';
require('child_process').exec(`py ${process.argv[2]} ${process.argv.slice(3).join(' ')}`, function (err, stdout, stderr) {
  if (err) throw err;
  console.error(stderr);
  console.log(stdout);
});