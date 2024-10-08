// vue.config.js
const webpack = require('webpack');
const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  transpileDependencies: true, // Keep the existing configuration for transpilation

  configureWebpack: {
    plugins: [
      new webpack.DefinePlugin({
        '__VUE_OPTIONS_API__': JSON.stringify(true),  // Enable Vue Options API
        '__VUE_PROD_DEVTOOLS__': JSON.stringify(false), // Disable devtools in production
        '__VUE_PROD_HYDRATION_MISMATCH_DETAILS__': JSON.stringify(false), // Define the hydration flag
      }),
    ],
  },
});
