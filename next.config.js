const withLess = require('@zeit/next-less');
const withCss = require('@zeit/next-css');
const lessToJS = require('less-vars-to-js')
const path = require('path');
const loaderUtils = require('loader-utils');
const fs = require('fs');

const themeVariables = lessToJS(
  fs.readFileSync(path.resolve(__dirname, './assets/antd-custom.less'), 'utf8')
)

function getLocalIdent(loaderContext, localIdentName, localName, options) {
  if (!options.context) {
    if (loaderContext.rootContext) {
      options.context = loaderContext.rootContext;
    } else if (loaderContext.options && typeof loaderContext.options.context === 'string') {
      options.context = loaderContext.options.context;
    } else {
      options.context = loaderContext.context;
    }
  }
  const request = path.relative(options.context, loaderContext.resourcePath);
  options.content = `${options.hashPrefix + request}+${localName}`;
  localIdentName = localIdentName.replace(/\[local\]/gi, localName);
  const hash = loaderUtils.interpolateName(loaderContext, localIdentName, options);
  return hash.replace(new RegExp('[^a-zA-Z0-9\\-_\u00A0-\uFFFF]', 'g'), '-').replace(/^((-?[0-9])|--)/, '_$1');
}

module.exports = withCss(withLess({
  cssModules: true,
  lessLoaderOptions: {
    javascriptEnabled: true,
    modifyVars: themeVariables,
  },

  cssLoaderOptions: {
    camelCase: true,
    localIdentName: '[local]___[hash:base64:5]',
    getLocalIdent: (context, localIdentName, localName, options) => {
      const hz = context.resourcePath.replace(context.rootContext, '');
      if (/node_modules/.test(hz)) {
        return localName;
      }
      return getLocalIdent(
        context,
        localIdentName,
        localName,
        options
      );
    }
  },
  webpack(config) {
    // antd support: exclude the effect of CSS Module.
    if (config.externals) {
      const includes = [/antd/];
      config.externals = config.externals.map((external) => {
        if (typeof external !== 'function') return external;
        return (ctx, req, cb) => (includes.find((include) => (req.startsWith('.') ? include.test(path.resolve(ctx, req)) : include.test(req)))
          ? cb()
          : external(ctx, req, cb));
      });
    }
    return config;
  }
}))

