var authMiddleware = require('../middlewares/auth.validation.middleware'),
  request = require('request'),
  config = require('../common/config'),
  cache = require('../common/cache'),
  cacheStore = 'grocery';

exports.search = async (req, res) => {
  const userFromReq = await authMiddleware.requestingUser(req.headers);
  var keyword = req.params.keyword;
  var cachedData = await cache.get(cacheStore, keyword);
  if (cachedData) {
    console.log('retrieved from cache');
    res.json(cachedData);
  } else {
    var options = {
      'method': 'GET',
      'url': `${config.spoonacularUrl}/food/ingredients/autocomplete?query=${keyword}&number=100&metaInformation=true&intolerances=false&apiKey=${config.spoonacular_apikey}`,
      'headers': {
        'Content-Type': 'application/json'
      }
    };
    request(options, function (error, response) {
      if (error) throw new Error(error);
      console.log(response.body);
      cache.set(cacheStore, keyword, JSON.parse(response.body));
      res.json(JSON.parse(response.body));
    });
  }
};