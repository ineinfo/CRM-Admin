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

    // Additional Webpack optimizations (optional, depending on your project)
    config.resolve.fallback = {
      fs: false, // If you're using file system in the client-side, add this to avoid errors
      path: false,
      os: false,
    };

    return config;
  },


};
