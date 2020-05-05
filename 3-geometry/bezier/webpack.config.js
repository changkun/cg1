const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = env => {
  const dist = env && env.prod
  const config = {
    mode: dist ? 'production' : 'development',
    performance: { hints: false },
    entry: { build: './src/main.js' },
    plugins: [
      new CopyWebpackPlugin([
        {from: 'src/assets', to: 'assets'}
      ]),
      new HtmlWebpackPlugin({
        title: 'LMU Munich CG1 SS2020',
        meta: {
          viewport: 'width=device-width, initial-scale=1, shrink-to-fit=no, maximum-scale=1.0, user-scalable=no'
        }
      }),
    ],
    output: {
      filename: '[name].js',
      path: path.resolve(__dirname, 'build')
    },
    module: {
      rules: [{
        test: /\.(glsl|vs|fs|vert|frag)$/,
        use: ['raw-loader', 'glslify-loader']
      }, {
        test: /\.js$/,
        use: { loader: 'babel-loader',
          options: { compact: false, presets: [['@babel/preset-env']] }
        }
      }]
    }
  }
  if (!dist) { config.devtool = '#source-map' }
  return config
}
