var NodeCache = require('node-cache');

const cacheLife = 600;
const myCache = new NodeCache({ stdTTL: cacheLife, checkperiod: cacheLife + 20 });

exports.set = async (store, key, value) => {
  console.log('cache set', store, key, value);
  myCache.set(`${store}-${key}`, value);
}

exports.get = async (store, key) => {
  console.log('cache get', store, key);
  return myCache.get(`${store}-${key}`);
}