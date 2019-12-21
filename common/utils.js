var crypto = require('crypto'),
  nanoid = require('nanoid'),
  mongoose = require('mongoose'),
  Diet = mongoose.model('Diets');

exports.hashPassword = (password) => {
  var salt = crypto.randomBytes(16).toString('base64');
  var hash = crypto.createHmac('sha512', salt).update(password).digest('base64');
  return salt + '$' + hash;
};

exports.getUniqueShareId = async () => {
  let shareIdLoopCount = 0;

  const getId = async () => {
    const shareId = nanoid(10);
    console.log(`checking for ${shareId}`);

    await Diet.find({ shareId }, (err, diet) => {
      if (err)
        throw err;
      if(shareIdLoopCount === 3) // TODO fix this error handling
        throw new Error('System cannot assign a unique ID, try again');

      if (diet.length !== 0) {
        shareIdLoopCount++;
        console.log(`existing share id found, trying again attempt ${shareIdLoopCount}`);
        getId();
      }
    })
    .catch((err) => {
      console.log('error handler?');
    });
    return shareId;
  }

  return await getId();
};