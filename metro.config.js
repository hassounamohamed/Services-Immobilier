const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver.resolveRequest = (context, moduleName, platform) => {
  // Block react-native-maps on web
  if (platform === 'web' && moduleName === 'react-native-maps') {
    return {
      type: 'empty',
    };
  }
  
  // Ensure you call the default resolver.
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
