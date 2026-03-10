export default async function(eleventyConfig) {
		
	eleventyConfig.addPassthroughCopy({ 'src/favicon/*': '/' });
	[
		'src/_data/*',
		'src/assets/',
		'src/images/'
	].forEach((path) => {
		eleventyConfig.addPassthroughCopy(path);
	});

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