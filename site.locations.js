/***********************************************
 * Eleventy Plugin Generate Location Data
 * 
 * By John M. Wargo
 * https://johnwargo.com
 ***********************************************/

import fs from 'fs';
import path from 'node:path';
//@ts-ignore
import logger from 'cli-logger';

const APP_NAME = 'Eleventy-Plugin-Generate-Location-Data';
const durationStr = `[${APP_NAME}] Duration`;
const defaultLocationStr = './_site/api/locations.json';

// configure the logger
var conf = { console: true, level: logger.INFO };
conf.prefix = function (record) {
  return `[${APP_NAME}]`;
}
var log = logger(conf);

export default async function (eleventyConfig, options = {}) {

  // the following is a hidden/empty collection. This is the only way I can get
  // access to the collections API to build the list of posts I want to access.
  eleventyConfig.addCollection("internal_hidden_collection", (collectionApi) => {

    const debugMode = options.debugMode || false;
    log.level(debugMode ? log.DEBUG : log.INFO);
    log.debug('Debug mode enabled\n');

    // get the tag to use for the collection, default to post
    const tags = options.tags || ['post'];
    log.debug(`Using tags: ${tags.join(', ')}`);

    const outputFilePath = path.join(process.cwd(), options.outputFile || defaultLocationStr);
    log.debug(`Output file path: ${outputFilePath}`);
    const outputFolderPath = path.dirname(outputFilePath);
    log.debug(`Output folder: ${outputFolderPath}`);

    // make an empty array for the posts & locations
    var posts = [];
    var locations = [];

    log.info('Building post list...');
    console.time(durationStr);
    // Process each tag separately since getFilteredByTag looks for
    // posts with all of the tags, not just the one we want
    for (let tag of tags) {
      log.debug(`Getting articles tagged with the "${tag}" tag`);
      let tagPosts = collectionApi.getFilteredByTag(tag);
      log.debug(`Located ${tagPosts.length} "${tag}" articles`);
      posts.push(...tagPosts);
    }
    if (posts.length > 0) {
      // we have posts
      log.info(`Located ${posts.length} posts with location data`);
      // loop through the posts, adding the location data to the locations array
      for (let post of posts) {
        if (post.data.isLocation) {
          if (post.data.latitude == null || post.data.longitude == null) {
            log.warn(`Post "${post.data.title}" is missing latitude or longitude`);
            continue;
          }
          // https://geojson.org/
          let locRecord = {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [post.data.longitude, post.data.latitude]
            },
            properties: {
              name: post.data.title
            }
          }
          locations.push(locRecord);
        }
      }
      // sort the locations list by name
      locations.sort((a, b) => a.properties.name.localeCompare(b.properties.name));
      // console.dir(locations);

    } else {
      log.info(`No locations found in tag(s): ${tags.join(', ')}`);
    }

    // Add the features to the result object
    var result = {};
    result.type = "FeatureCollection";
    result.features = locations;

    log.debug(`Writing location data to ${outputFilePath}`);
    try {
      // Create the target folder (if it doesn't exist)
      fs.mkdirSync(outputFolderPath, { recursive: true });
      // write the locations object to the output file
      fs.writeFileSync(outputFilePath, JSON.stringify(result, null, 2));
    } catch (err) {
      log.error(`Error writing location data: ${err}`);
      process.exit(1);
    }

    log.info(`Location data written to ${outputFilePath}`);
    console.timeEnd(durationStr);
    // Return empty array so "collections.internal_hidden_capture" is effectively empty
    return result;
  });


};
