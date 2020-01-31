var NodeCache = require('node-cache');

const mins5 = 300;
const myCache = new NodeCache({ stdTTL: mins5, checkperiod: mins5 + 20 });

exports.set = async (key, value) => {
  console.log('setting', key, value);
  myCache.set(key, value);
}

exports.get = async (key) => {
  console.log('getting', key);
  return myCache.get(key);
}