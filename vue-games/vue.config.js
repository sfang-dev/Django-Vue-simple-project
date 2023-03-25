module.exports = {
  publicPath: 'http://localhost:8080',  // the base URL where your app will be deployed
  outputDir: '../static/dict',          // the path for where files will be output when the app is built
  indexPath: '../../templates/_base_vue.html', // the path for the generated index file

  configureWebpack: {
    devServer: {
      devMiddleware: {
        writeToDisk: true
      }
    }
  }
}
