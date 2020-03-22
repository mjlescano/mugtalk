const ExtraWatchWebpackPlugin = require('extra-watch-webpack-plugin')

module.exports = {
  webpack: (config) => {
    config.entry.main = ['./src/index.ts']

    config.resolve = {
      extensions: ['.ts', '.js', '.json']
    }

    config.module.rules.push({
      test: /\.ts$/,
      loader: 'awesome-typescript-loader'
    })

    config.plugins.push(
      new ExtraWatchWebpackPlugin({
        files: ['src/conf/*.yml']
      })
    )

    return config
  }
}
