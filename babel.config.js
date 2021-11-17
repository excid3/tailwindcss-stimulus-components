module.exports = process.env.NODE_ENV === 'test'
  ? {
    "presets": ["@babel/env"],
    "plugins": [
      "@babel/plugin-proposal-class-properties",
      "@babel/plugin-transform-runtime"
    ]
  }
  : {}
