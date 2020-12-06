module.exports = {
  chainWebpack: config => {
    config
    .plugin('html')
    .tap(args => {
      args[0].title = 'Mapi'
      return args
    })
  },
  transpileDependencies: [
    'vuetify'
  ],
  devServer: {
    disableHostCheck: true
  },
  pwa: {
    name: 'Mapi',
    themeColor: "#ffffff",
    msTileColor: "#ffffff",
    manifestOptions: {
      background_color: "#ffffff",
    },
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'default'
  }
}
