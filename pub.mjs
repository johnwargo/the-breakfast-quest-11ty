#!/usr/bin/env zx

const algoliaPrefix = 'TBQ_';

// With ZX the first three commands are the node executable, the zx executable, and the script name
// [
//   'C:\\Program Files\\nodejs\\node.exe',
//   'C:\\Users\\john\\AppData\\Roaming\\npm\\node_modules\\zx\\build\\cli.js',
//   'pub.mjs'
// ]
var theArgs = process.argv.slice(3);
var updatePackage = false;
var updateIndex = false;

console.time();
console.log('\nStarting project publish...');

// Check the command line arguments to see if we should increment the version
let idx = theArgs.indexOf('-i');
if (idx > -1) {
  updatePackage = true;
  // remove the -i argument from the array
  theArgs.splice(idx, 1);
} else {
  console.log('Skipping package version increment');
}

// Check the command line arguments to see if we should update the Algolia index
idx = theArgs.indexOf('-a');
if (idx > -1) {
  updateIndex = true;
  // remove the -a argument from the array
  theArgs.splice(idx, 1);
} else {
  console.log('Skipping Algolia index update');
}

// Do we have a commit message?
if (theArgs.length === 0) {
  console.log('\nMissing commit message on command line (in quotes)');
  process.exit(1);
}

// Do we have too many command line arguments?
if (theArgs.length > 1) {
  console.log('\nToo many command line arguments, make sure the commit message is in quotes');
  process.exit(1);
}

if (updatePackage) {
  // have to do this here, otherwise the site will have the wrong
  // build information in it. This means two commits, because
  // you can't do a version increment unless all local changes
  // are committed to the repo first. 
  await $`git add -A`;
  await $`git commit -m ${theArgs[0]}`;
  let msg = "Incrementing package version";
  console.log(`\n${msg}`);
  await $`npm version patch`;
}

console.log();
await $`gen-build-info src/_data`;

console.log('\nBuilding site');
await $`npm run build`;

if (updateIndex) {
  console.log('\nUpdating Algolia Index');
  await $`algolia-idxup _site/algolia.json ${algoliaPrefix} -d -f ../algolia-creds.json`;
}

await $`git add -A`;
await $`git commit -m ${theArgs[0]}`;
await $`git push`;

console.log('\nFinished!');
console.timeEnd();