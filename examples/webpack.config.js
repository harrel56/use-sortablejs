const path = require('path');

module.exports = {
  mode: 'production',
  entry: {
    'examples': '@examples/App.tsx'
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'build'),
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      '@examples': path.resolve(__dirname, './src')
    }
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/i,
        use: ['ts-loader'],
        exclude: /node_modules/
      },
    ],
  },
};
