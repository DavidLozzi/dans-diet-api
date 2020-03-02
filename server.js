var
  app = require('./app'),
  port = process.env.PORT || 3001;

app.listen(port);

console.log('Dans Diet API started on: ' + port);