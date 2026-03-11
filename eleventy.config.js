import { eleventyImageTransformPlugin } from '@11ty/eleventy-img';
import pluginDate from 'eleventy-plugin-date';
import pluginRss from '@11ty/eleventy-plugin-rss';

// My plugins
import generateCategoryPages from 'eleventy-generate-category-pages';

// local plugins
import pluginGallery from "./eleventy.config.gallery.js";
import pluginImageHeaders from './eleventy.config.headerimage.js';
// transforms
import htmlMinTransform from './src/transforms/html-min.js';

const isProduction = process.env.NODE_ENV === 'production';
const categoryDataFile = 'categoryData.json';

export default async function (eleventyConfig) {

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
			class: 'image-full'
		}
	});

	eleventyConfig.addPlugin(pluginImageHeaders, {
		dataFileName: categoryDataFile,
		imageClass: 'image fit'
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
			});
		}
	});

	eleventyConfig.addPassthroughCopy({ 'src/favicon/*': '/' });
	[
		'src/_data/*',
		'src/assets/',
		// 'src/images/'
	].forEach((path) => {
		eleventyConfig.addPassthroughCopy(path);
	});

	// Only minify HTML if we are in production
	if (isProduction) eleventyConfig.addTransform('htmlmin', htmlMinTransform);

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