'use strict';
require('child_process').exec(`python ${process.argv[2]}`, function (err, stdout, stderr) {
  if (err) throw err;
  console.error(stderr);
  console.log(stdout);
});
