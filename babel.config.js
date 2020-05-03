module.exports = {
  presets: ['@babel/env', '@babel/react'],
  env: {
    test: {
      presets: [['@babel/preset-env'], ['@babel/preset-react']],
      plugins: [['@babel/plugin-syntax-dynamic-import']]
    }
  }
};
