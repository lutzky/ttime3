const path = require('path');

module.exports = env => {
  isProduction = false;
  if (env && env.production) {
    isProduction = true;
  }
  console.log('Production:', isProduction);

  return {
    mode: isProduction ? 'production' : 'development',
    devtool: isProduction ? false : 'inline-source-map',
    entry: './src/main.ts',
    output: {
      filename: 'ttime.js',
      library: 'ttime',
      libraryTarget: 'umd',
      path: path.resolve(__dirname, 'dist'),
      publicPath: 'dist/'
    },
    resolve: {
      // Add `.ts` and `.tsx` as a resolvable extension.
      extensions: ['.ts', '.tsx', '.js'],
      modules: ['node_modules']
    },
    module: {
      rules: [
        // all files with a `.ts` or `.tsx` extension will be handled by
        // `ts-loader`
        {test: /\.tsx?$/, loader: 'ts-loader'}
      ]
    }
  };
};
