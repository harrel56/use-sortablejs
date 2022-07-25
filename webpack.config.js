const path = require('path');

module.exports = {
  mode: 'development',
  entry: {
    'react-sortablejs': '@react-sortablejs/Sortable.tsx',
    'examples': '@examples/App.tsx'
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'build'),
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      '@react-sortablejs': path.resolve(__dirname, './src'),
      '@examples': path.resolve(__dirname, './examples/src')
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