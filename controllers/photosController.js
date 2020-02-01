var request = require('request'),
  config = require('../common/config'),
  cache = require('../common/cache'),
  cacheStore = 'photo';

const formatPhotos = (photos) => {
  const newPhotos = [];
  photos.results.map((photo) => {
    const {
      id,
      color,
      urls: {
        small,
        thumb
      },
      links: {
        html
      },
      user: {
        id: userid,
        username,
        name
      }
    } = photo;

    newPhotos.push({
      id,
      color,
      imageUrl: small,
      thumbnailUrl: thumb,
      sourceUrl: html,
      user: {
        id: userid,
        username,
        name
      }
    })
  })
  return newPhotos;
}

exports.search = async (req, res) => {
  var keyword = req.params.keyword;
  var cachedData = await cache.get(cacheStore, keyword);
  if (cachedData) {
    console.log('retrieved from cache');
    res.json(cachedData);
  } else {
    var options = {
      'method': 'GET',
      'url': `${config.unsplash.url}${config.unsplash.search(keyword)}`,
      'headers': {
        'Authorization': `Client-ID ${config.unsplash_accesskey}`,
        'Content-Type': 'application/json'
      }
    };
    console.log(options);

    request(options, function (error, response) {
      if (error) throw new Error(error);
      if (response.body === 'Rate Limit Exceeded') {
        res.status(500).json(response.body);
        return;
      }
      console.log(response.body);
      const photos = formatPhotos(JSON.parse(response.body));
      cache.set(cacheStore, keyword, photos);
      res.json(photos);
    });
  }
};
