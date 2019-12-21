var 
  express = require('express'),
  cors = require('cors'),
  mongoose = require('mongoose'),
  bodyParser = require('body-parser'),
  app = express(),
  router = express.Router(),
  port = process.env.PORT || 3001;

var // models
  User = require('./models/usermodel'),
  Diet = require('./models/dietModel'),
  Food = require('./models/foodModel');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/DansDietDB');

app.use(cors({ origin: '*', optionsSuccessStatus: 200 }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var userRoutes = require('./routes/userRoutes');
userRoutes(app, router);

var signupRoutes = require('./routes/signupRoutes');
signupRoutes(app, router);

var authRoutes = require('./routes/authRoutes');
authRoutes(app);

var dietRoutes = require('./routes/dietRoutes');
dietRoutes(app, router);

var foodRoutes = require('./routes/foodRoutes');
foodRoutes(app, router);

app.use((req, res) => {
  res.status(404).send({url: req.originalUrl + ' not found'});
});

app.listen(port);

console.log('Dans Diet API started on: ' + port);

