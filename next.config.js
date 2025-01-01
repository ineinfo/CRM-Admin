const path = require('path');

module.exports = {
  trailingSlash: true,
  modularizeImports: {
    '@mui/icons-material': {
      transform: '@mui/icons-material/{{member}}',
    },
    '@mui/material': {
      transform: '@mui/material/{{member}}',
    },
    '@mui/lab': {
      transform: '@mui/lab/{{member}}',
    },
  },
  webpack(config) {
    // Handling SVG imports using @svgr/webpack
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    config.module.rules.push({
      test: /\.(woff|woff2|eot|ttf|otf)$/,
      use: [
        {
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            outputPath: 'fonts/',
          },
        },
      ],
    });

    // Additional Webpack optimizations (optional, depending on your project)
    config.resolve.fallback = {
      fs: false, // If you're using file system in the client-side, add this to avoid errors
      path: false,
      os: false,
    };

    config.resolve.alias['slick-carousel/slick/slick-theme.css'] = path.resolve(__dirname, 'node_modules/slick-carousel/slick/slick-theme.css');
    config.resolve.alias['slick-carousel/slick/slick.css'] = path.resolve(__dirname, 'node_modules/slick-carousel/slick/slick.css');

    return config;
  },
};
