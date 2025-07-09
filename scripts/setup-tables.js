const AWS = require('aws-sdk');
const config = require('../common/config');

// Configure AWS SDK
AWS.config.update({
  region: config.aws.region,
  accessKeyId: config.aws.accessKeyId,
  secretAccessKey: config.aws.secretAccessKey,
  endpoint: config.aws.endpoint
});

const dynamodb = new AWS.DynamoDB();

const createTable = async (params) => {
  try {
    const result = await dynamodb.createTable(params).promise();
    console.log(`Table ${params.TableName} created successfully:`, result.TableDescription.TableName);
    return result;
  } catch (error) {
    if (error.code === 'ResourceInUseException') {
      console.log(`Table ${params.TableName} already exists`);
    } else {
      console.error(`Error creating table ${params.TableName}:`, error);
      throw error;
    }
  }
};

const waitForTable = async (tableName) => {
  console.log(`Waiting for table ${tableName} to be active...`);
  try {
    await dynamodb.waitFor('tableExists', { TableName: tableName }).promise();
    console.log(`Table ${tableName} is now active`);
  } catch (error) {
    console.error(`Error waiting for table ${tableName}:`, error);
    throw error;
  }
};

const setupTables = async () => {
  try {
    // Users table
    const usersTableParams = {
      TableName: config.dynamodb.tables.users,
      KeySchema: [
        { AttributeName: 'id', KeyType: 'HASH' }
      ],
      AttributeDefinitions: [
        { AttributeName: 'id', AttributeType: 'S' },
        { AttributeName: 'email', AttributeType: 'S' }
      ],
      BillingMode: 'PAY_PER_REQUEST',
      GlobalSecondaryIndexes: [
        {
          IndexName: 'email-index',
          KeySchema: [
            { AttributeName: 'email', KeyType: 'HASH' }
          ],
          Projection: { ProjectionType: 'ALL' }
        }
      ]
    };

    // Diets table
    const dietsTableParams = {
      TableName: config.dynamodb.tables.diets,
      KeySchema: [
        { AttributeName: 'id', KeyType: 'HASH' }
      ],
      AttributeDefinitions: [
        { AttributeName: 'id', AttributeType: 'S' },
        { AttributeName: 'userId', AttributeType: 'S' },
        { AttributeName: 'shareId', AttributeType: 'S' }
      ],
      BillingMode: 'PAY_PER_REQUEST',
      GlobalSecondaryIndexes: [
        {
          IndexName: 'userId-index',
          KeySchema: [
            { AttributeName: 'userId', KeyType: 'HASH' }
          ],
          Projection: { ProjectionType: 'ALL' }
        },
        {
          IndexName: 'shareId-index',
          KeySchema: [
            { AttributeName: 'shareId', KeyType: 'HASH' }
          ],
          Projection: { ProjectionType: 'ALL' }
        }
      ]
    };

    // Foods table
    const foodsTableParams = {
      TableName: config.dynamodb.tables.foods,
      KeySchema: [
        { AttributeName: 'id', KeyType: 'HASH' }
      ],
      AttributeDefinitions: [
        { AttributeName: 'id', AttributeType: 'S' },
        { AttributeName: 'userId', AttributeType: 'S' },
        { AttributeName: 'dietId', AttributeType: 'S' }
      ],
      BillingMode: 'PAY_PER_REQUEST',
      GlobalSecondaryIndexes: [
        {
          IndexName: 'userId-index',
          KeySchema: [
            { AttributeName: 'userId', KeyType: 'HASH' }
          ],
          Projection: { ProjectionType: 'ALL' }
        },
        {
          IndexName: 'dietId-index',
          KeySchema: [
            { AttributeName: 'dietId', KeyType: 'HASH' }
          ],
          Projection: { ProjectionType: 'ALL' }
        }
      ]
    };

    // Logs table
    const logsTableParams = {
      TableName: config.dynamodb.tables.logs,
      KeySchema: [
        { AttributeName: 'id', KeyType: 'HASH' }
      ],
      AttributeDefinitions: [
        { AttributeName: 'id', AttributeType: 'S' },
        { AttributeName: 'userId', AttributeType: 'S' }
      ],
      BillingMode: 'PAY_PER_REQUEST',
      GlobalSecondaryIndexes: [
        {
          IndexName: 'userId-index',
          KeySchema: [
            { AttributeName: 'userId', KeyType: 'HASH' }
          ],
          Projection: { ProjectionType: 'ALL' }
        }
      ]
    };

    // Create tables
    await createTable(usersTableParams);
    await createTable(dietsTableParams);
    await createTable(foodsTableParams);
    await createTable(logsTableParams);

    // Wait for tables to be active
    await waitForTable(config.dynamodb.tables.users);
    await waitForTable(config.dynamodb.tables.diets);
    await waitForTable(config.dynamodb.tables.foods);
    await waitForTable(config.dynamodb.tables.logs);

    console.log('All tables created successfully!');
  } catch (error) {
    console.error('Error setting up tables:', error);
    process.exit(1);
  }
};

if (require.main === module) {
  setupTables();
}

module.exports = setupTables;