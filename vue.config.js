const { defineConfig } = require('@vue/cli-service')
const path = require('path');
const webpack = require('webpack');
module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    plugins: [
      // Define Bundler Build Feature Flags
      new webpack.DefinePlugin( {
          __VUE_I18N_FULL_INSTALL__: true,
          __VUE_I18N_LEGACY_API__: true,
          __VUE_I18N_PROD_DEVTOOLS__: false,
          __INTLIFY_PROD_DEVTOOLS__: false
      } ),
  ],
    resolve: {
      alias: {
        "@components": path.resolve(__dirname, 'src/components'),
        "@composables": path.resolve(__dirname, 'src/composables'),
        "@plugins": path.resolve(__dirname, 'src/plugins'),
        "@config": path.resolve(__dirname, 'src/config'),
        "@router": path.resolve(__dirname, 'src/router'),
        "@assets": path.resolve(__dirname, 'src/assets'),
        "@middleware": path.resolve(__dirname, 'src/middleware'),
      },
      extensions: ['.js', '.vue', '.json']
    }
  },
})
