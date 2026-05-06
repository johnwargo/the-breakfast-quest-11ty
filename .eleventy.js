import eleventyNavigationPlugin from "@11ty/eleventy-navigation";
import { eleventyImageTransformPlugin } from '@11ty/eleventy-img';
import pluginDate from 'eleventy-plugin-date';
import pluginRss from '@11ty/eleventy-plugin-rss';
// My plugins
import generateCategoryPages from 'eleventy-generate-category-pages';
// local plugins
import pluginGallery from "./.gallery.js";
import pluginLocations from './.locations.js';
import pluginImageHeaders from './.headerimage.js';
// transforms
import htmlMinify from './transforms/transform-minify.js';
import htmlPrettify from './transforms/transform-prettify.js';

const isProduction = process.env.NODE_ENV === 'production';
const categoryDataFile = 'categoryData.json';

export default async function (eleventyConfig) {

	eleventyConfig.addPlugin(eleventyNavigationPlugin);
	eleventyConfig.addPlugin(pluginDate);
	eleventyConfig.addPlugin(pluginGallery);
	eleventyConfig.addPlugin(pluginRss);

	// https://www.aleksandrhovhannisyan.com/blog/eleventy-image-transform/
	eleventyConfig.addPlugin(eleventyImageTransformPlugin, {
		// which file extensions to process
		extensions: 'html',
		// optional, output image formats
		formats: ['jpg', 'webp'],
		// optional, output image widths
		widths: ['auto', 400, 800, 1024],
		// optional, attributes assigned on <img> override these values.
		defaultAttributes: {
			loading: 'lazy',
			decoding: 'async',
			class: 'image fit"'
		}
	});

	eleventyConfig.addPlugin(pluginImageHeaders, {
		dataFileName: categoryDataFile,
		imageClass: 'image fit'
	});

	eleventyConfig.addCollection('articlesByTimestamp', collectionAPI => {
		return collectionAPI.getFilteredByTag('post').sort((a, b) => {
			// use the timestamp if we have it, otherwise date
			var aDate = a.data.timestamp ? new Date(a.data.timestamp) : new Date(a.date);
			var bDate = b.data.timestamp ? new Date(b.data.timestamp) : new Date(b.date);
			return aDate - bDate;
		});
	});

	eleventyConfig.addCollection('reviewsByTimestamp', collectionAPI => {
		return collectionAPI.getFilteredByTag('post').filter(post => post.data.isLocation)
			.sort((a, b) => {
				var aDate = a.data.timestamp ? new Date(a.data.timestamp) : new Date(a.date);
				var bDate = b.data.timestamp ? new Date(b.data.timestamp) : new Date(b.date);
				return aDate - bDate;
			});
	});

	eleventyConfig.addCollection('reviewsByName', collectionAPI => {
		return collectionAPI.getFilteredByTag('post').filter(post => post.data.isLocation)
			.sort((a, b) => {
				let titleA = a.data.title || "";
				let titleB = b.data.title || "";
				return titleB.localeCompare(titleA);
			});
	});

	eleventyConfig.addFilter('readableTimestamp', function (dateVal, locale = 'en-us') {
		// Used by home, articles, & post pages to render timestamp as human readable
		var theDate = new Date(dateVal);
		const options = {
			weekday: 'long',
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			hour12: true,
			hour: '2-digit',
			minute: '2-digit'
		};
		return theDate.toLocaleString(locale, options);
	});

	eleventyConfig.addFilter('algExcerpt', function (text) {
		//first remove code
		text = text.replace(/<code class="language-.*?">.*?<\/code>/sg, '');
		//now remove html tags
		text = text.replace(/<.*?>/g, '');
		// remove carriage returns
		text = text.replace(/\r\n|\r|\n/g, ' ');
		// remove extra spaces
		text = text.replace(/[ ]{2,}/g, ' ');
		//now limit to 5k
		return text.substring(0, 5000);
	});

	eleventyConfig.addShortcode('GetKeywords', categories => {
		return categories.join(', ');
	});

	var firstRun = true;
	eleventyConfig.on('eleventy.before', async ({ dir, runMode, outputMode }) => {
		if (firstRun) {
			firstRun = false;
			generateCategoryPages({
				dataFileName: categoryDataFile,
				imageProperties: true,
				quitOnError: true,
				debugMode: false
			})
			pluginLocations(eleventyConfig, { debugMode: false });
		}
	});

	// Make sure all the files we need are deployed with the site
	eleventyConfig.addPassthroughCopy({ 'src/favicon/*': '/' });
	[
		'src/_data/',
		'src/assets/'
	].forEach((path) => {
		eleventyConfig.addPassthroughCopy(path);
	});

	// What do we want the source code to look like?
	if (isProduction) {
		// Only minify HTML if we are in production
		eleventyConfig.addTransform('txHtmlMinify', htmlMinify);
	} else {
		// otherwise prettify
		eleventyConfig.addTransform('txHtmlPrettify', htmlPrettify);
	}

	return {
		dir: {
			input: 'src',
			output: '_site',
			includes: '_includes',
			layouts: '_layouts',
			data: '_data'
		}
	}

};