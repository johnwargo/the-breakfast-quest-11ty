/***********************************************
 * Eleventy Plugin Generate Location Data
 * 
 * By John M. Wargo
 * https://johnwargo.com
 ***********************************************/

import fs from 'fs';
//@ts-ignore
import logger from 'cli-logger';

const APP_NAME = 'Eleventy-Plugin-Generate-Location-Data';
const durationStr = `[${APP_NAME}] Duration`;
const oneDayMilliseconds = 1000 * 60 * 60 * 24;

// configure the logger
var conf = { console: true, level: logger.INFO };
conf.prefix = function (record) {
  return `[${APP_NAME}]`;
}
var log = logger(conf);

export default function (eleventyConfig, options = {}) {

  // the following is a hidden/empty collection. This is the only way I can get
  // access to the collections API to build the list of posts I want to access.
  eleventyConfig.addCollection("internal_hidden_collection", (collectionApi) => {

    const debugMode = options.debugMode || false;
    log.level(debugMode ? log.DEBUG : log.INFO);
    log.debug('Debug mode enabled\n');

    // get the tag to use for the collection, default to post
    const tags = options.tags || ['post'];
    log.debug(`Using tags: ${tags.join(', ')}`);
    // output file name
    const outputFile = options.outputFile || './src/_data/locations.json';
    log.debug(`Output file: ${outputFile}`);

    // make an empty array for the posts & locations
    var posts = [];
    var locations = [];

    // Process each tag separately since getFilteredByTag looks for
    // posts with all of the tags, not just the one we want
    for (let tag of tags) {
      log.info(`Getting articles tagged with the "${tag}" tag`);
      let tagPosts = collectionApi.getFilteredByTag(tag);
      log.info(`Located ${tagPosts.length} "${tag}" articles`);
      posts.push(...tagPosts);
    }
    const postCount = posts.length;
    if (postCount < 1) {
      // we have posts
      log.info(`Located ${postCount} posts with location data`);

      // loop through the posts, adding the location data to the locations array



    } else {
      log.info(`No locations found in tag(s): ${tags.join(', ')}`);
    }

    if (debugMode) {
      console.dir(locations);
    }
    // write the locations object to the output file
    try {
      fs.writeFileSync(outputFile, JSON.stringify(locations, null, 2));
      log.info(`Location data written to ${outputFile}`);
    } catch (err) {
      log.error(`Error writing locations data to ${outputFile}: ${err}`);
    }

    log.info(`Completed location data generation`);
    console.timeEnd(durationStr);

    // Return empty array so "collections.internal_hidden_capture" is effectively empty
    return [];
  });

};
