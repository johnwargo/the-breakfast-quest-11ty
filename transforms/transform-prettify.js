import prettier from 'prettier';

export default async function (value, outputPath) {

  if (outputPath && outputPath.indexOf('.html') > -1) {
    return await prettier.format(value, {
      parser: "html",
      printWidth: 120,
      tabWidth: 2,
    });
  }
  return value;
};
