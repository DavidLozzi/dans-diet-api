const AWS = require('aws-sdk');
const config = require('./config');

// Configure AWS SDK
AWS.config.update({
  region: config.aws.region,
  accessKeyId: config.aws.accessKeyId,
  secretAccessKey: config.aws.secretAccessKey,
  endpoint: config.aws.endpoint
});

const dynamodb = new AWS.DynamoDB();
const docClient = new AWS.DynamoDB.DocumentClient();

module.exports = {
  dynamodb,
  docClient,
  tables: config.dynamodb.tables
};