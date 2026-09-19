// ==============================================
// Category Header Image(s)
// By John M. Wargo
// ==============================================

import path from "path";

export default function (eleventyConfig, options = {}) {

  const moduleName = "eleventy.config.headerimage";

  const useDefaultImage = false;
  const defaultImageObject = {
    imageFilePath: "",
    imageAltText: "",
    imageAttribution: ""
  }

  if (useDefaultImage && defaultImageObject.imageFilePath.length < 1) {
    _logIt(moduleName, "ERROR: Default image enabled, but imageFilePath is undefined\n");
    process.exit(1);  // exit hard
  }

  // parse the options passed to the module
  const debugMode = options.debugMode ? options.debugMode : false;

  const categoryData = options.dataFileName ? path.parse(options.dataFileName).name : 'categoryData';
  _logIt(moduleName, `Category data: ${categoryData}`);
  
  const imageClass = options.imageClass ? options.imageClass : '';
  if (imageClass.length > 0) _logIt(moduleName, `Image Class: ${imageClass}`);

  function _logIt(shortCodeName, msg) {
    if (debugMode) console.log(`[${shortCodeName}] ${msg}`);
  }

  /**
   * 
   * @param {*} categoryData 
   * @param {string[]} categories 
   * @param {boolean} useDefaultImage 
   * @returns 
   */
  function _getCategoryImage(categoryData, categories, useDefaultImage) {
    // Initialize to default of no image properties
    const imageObject = {
      imageFilePath: '',
      imageAltText: '',
      imageAttribution: ''
    }

    // Do we have any category metadata?
    if (categoryData && categoryData.length < 1) {
      // No, then we know what to return (because we won't have any image 
      // properties to pull from)
      return useDefaultImage ? defaultImageObject : imageObject;
    }

    // find the first category of categories that has an imageFilePath 
    // property populated
    for (var idx in categories) {
      var cat = categoryData.find(category => categories[idx] === category.category);
      if (cat && cat.imageFilePath && cat.imageFilePath.length > 0) {
        imageObject.imageFilePath = cat.imageFilePath;
        imageObject.imageAltText = cat.imageAltText;
        imageObject.imageAttribution = cat.imageAttribution;
        break;
      }
    }
    // did we get one? No? Then use the default image if allowed
    return imageObject.imageFilePath.length < 1 && useDefaultImage ? defaultImageObject : imageObject;
  }

  eleventyConfig.addShortcode("CategoryImage", function (categories) {
    function _buildImageTag(imagePath, imageAltText) {
      if (imagePath) {
        return imageClass.length > 0
          ? `<img eleventy:ignore src="${imagePath}" alt="${imageAltText}" class="${imageClass}" />`
          : `<img eleventy:ignore src="${imagePath}" alt="${imageAltText}" />`;
      } else {
        return '';
      }
    }

    // Leave if there's no category passed in (for pages that don't have categories)
    if (!categories) return '';
    // For the Category page use case, it's not an array, so convert it into one first
    if (!Array.isArray(categories)) categories = [categories];
    _logIt("CategoryImage", categories && categories.length > 0 ? categories[0] : "No categories");
    let res = _getCategoryImage(this.ctx.environments[categoryData], categories, useDefaultImage);
    return _buildImageTag(res.imageFilePath, res.imageAltText);
  });

  eleventyConfig.addShortcode("CategoryImageAttribution", function (categories) {
    // Leave if there's no category passed in (for pages that don't have categories)
    if (!categories) return '';
    // For the Category page use case, it's not an array, so convert it into one first
    if (!Array.isArray(categories)) categories = [categories];
    _logIt("CategoryImageAttribution", categories && categories.length > 0 ? categories[0] : "No categories");
    let res = _getCategoryImage(this.ctx.environments[categoryData], categories, useDefaultImage);
    return res.imageAttribution.length > 0 ? `<p>Header image: ${res.imageAttribution}</p>` : '';
  });

}
