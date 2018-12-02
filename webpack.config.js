module.exports = {
  mode: 'development',
  devtool: 'inline-source-map',
  entry: './src/main.ts',
  output: {
    filename: 'dist/ttime.js',
    library: 'ttime',
    libraryTarget: 'umd'
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
