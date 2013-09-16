const os = require('os');
const path = require('path');

const s = require('shelljs');

const BUILD = path.join(__dirname, 'build.js');
const WHITELIST = ['CNAME'];

// this builds the static file, and pushes it to a branch on github
// Usage: node ./scripts/deploy.js <branch-name>
// Example: node ./scripts/deploy.js gh-pages

var deployBranch = process.argv[2];
if (!deployBranch) {
  console.log('Usage: node ./scripts/deploy.js <branch-name>');
  process.exit(1);
}
console.log('Deploying ' + deployBranch + '...');

// get deploy version
var version = s.exec('git rev-parse HEAD', { silent: true }).output;

// run the build script
console.log('Building static site...');
s.exec('node ' + BUILD);

// copy build directory to tmpdir
const TMP = path.join(os.tmpDir(), 'build-' + version);
s.cp('-Rf', './build', TMP);

// checkout <branch-name>
var currentBranch = s.exec('git rev-parse --abbrev-ref HEAD', { silent: true }).output;
s.exec('git checkout ' + deployBranch);

// clean out all files not on whitelist
var files = s.ls('-A', './').filter(function(name) {
  return !WHITELIST.indexOf(name);
});

s.rm('-Rf', files);

// cp build/* to ./*
s.cp('-Rf', path.join(TMP, '*'),'./');

// remove build/*
s.rm('-Rf', './build');

// git add .
s.exec('git add .');

// git commit
s.exec('git commit -am "deployment of ' + version + '"');

// git push
s.exec('git push');

// git checkout last branch
s.exec('git checkout ' + currentBranch);

console.log('Deployment complete!');
