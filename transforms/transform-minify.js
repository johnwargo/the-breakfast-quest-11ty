// https://learneleventyfromscratch.com/lesson/31.html#minifying-html-output

import htmlmin from 'html-minifier';

export default function (value, outputPath) {
  if (outputPath && outputPath.indexOf('.html') > -1) {
    return htmlmin.minify(value, {
      collapseWhitespace: true,
      maxLineLength: 120,
      minifyCSS: true,
      minifyJS: true,
      removeComments: true,
      useShortDoctype: true
    });
  }
  return value;
};