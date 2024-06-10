const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');
const path = require('path');
const { InjectManifest } = require('workbox-webpack-plugin');

// TODO: Add and configure workbox plugins for a service worker and manifest file.
// TODO: Add CSS loaders and babel to webpack.

module.exports = () => {
  return {

    mode: 'development',
    entry: {  // 3 entry points here
      main: './src/js/index.js',
      install: './src/js/install.js',
      editor: './src/js/editor.js',
    },
    output: {
      filename: '[name].bundle.js', // **[name] will be replaced by the name of the entry point (for the main entry point the output file will be main.bundle.js, for the install entry point - install.bundle.js).
      path: path.resolve(__dirname, 'dist'),
    },

    plugins: [

      // webpack plugin that generates our html file and injects our bundles. 
      new HtmlWebpackPlugin({
        template: './index.html',
        title: 'Text Editor'
      }),

      // injects our custom service worker
      new InjectManifest({
        swSrc: './src-sw.js',
        swDest: 'src-sw.js',
      }),

      // creates a manifest.json file.
      new WebpackPwaManifest({
        fingerprints: false,
        inject: true,   // automatically injects the manifest link tag into the HTML.
        name: 'Just Another Text Editor',   // sets the full name of the PWA.
        short_name: 'J.A.T.E',    // sets the short name of the PWA, used when there is limited space.
        description: 'Take notes with JavaScript syntax highlighting!',   // provides a description of the PWA.
        background_color: '#225ca3',
        theme_color: '#225ca3',
        start_url: './',
        publicPath: './',
        display: 'standalone',   //*
        orientation: 'portrait', //*
        icons: [
          {
            src: path.resolve('src/images/logo.png'),
            sizes: [96, 128, 192, 256, 384, 512],
            destination: path.join('assets', 'icons'),  // ensures that all the icons are stored in the assets/icons directory within the build output.
          },
        ],
      }),
      
    ],

    module: {
      rules: [
        // css loaders
        {
          test: /\.css$/i, 
          use: ['style-loader', 'css-loader'], 
        },
        // babel loader in order to use ES6.
        {
          test: /\.m?js$/,
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: 'babel-loader', 
            options: {
              presets: ['@babel/preset-env'],
              plugins: ['@babel/plugin-proposal-object-rest-spread', '@babel/transform-runtime'],
            }
          }
        }
        
      ],
    },
  };
};


// **the name of the output file is determined by the key in the entry object, not the name of the input file.