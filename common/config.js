var myConfig = require('./myConfig');

var config = {
  spoonacularUrl: 'https://api.spoonacular.com'
}

var ourConfig = Object.assign(myConfig, config);

module.exports = ourConfig;