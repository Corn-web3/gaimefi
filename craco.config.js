const path = require("path");

module.exports = {
  webpack: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },

    configure: {
      resolve: {
        fallback: {
          http: require.resolve("stream-http"),
          https: require.resolve("https-browserify"),
          stream: require.resolve("stream-browserify"),
          crypto: require.resolve("crypto-browserify"),
          zlib: require.resolve("browserify-zlib"),
          path: require.resolve("path-browserify"),
          buffer: require.resolve("buffer/"),
          url: require.resolve("url/"), // Add this line
          assert: require.resolve("assert/"), // Might also need
          os: require.resolve("os-browserify/browser"), // Might also need
        },
      },
    },
  },

  devServer: {
    // headers: {
    //   'Content-Security-Policy': generateCSPString(
    //     isDevelopment ? cspConfig.development : cspConfig.production
    //   )
    // },
    proxy: {
      "/api": {
        target: "https://api.gaime.fun/api",
        //target: "https://api-staging.gaime.fun/api",
        // target: "https://api-staging.gaime.fun/api",
        // target: "https://api.gaime.fun/api",
        changeOrigin: true,
        pathRewrite: {
          "^/api": "",
        },
      },
    },
  },
};
