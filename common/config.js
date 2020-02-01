var myConfig = require('./myConfig');

var config = {
  spoonacularUrl: 'https://api.spoonacular.com',
  unsplash: {
    url: 'https://api.unsplash.com/',
    search: (keyword) => `search/photos?page=1&per_page=25&query=${keyword}`
  }
}

var ourConfig = Object.assign(myConfig, config);

module.exports = ourConfig;