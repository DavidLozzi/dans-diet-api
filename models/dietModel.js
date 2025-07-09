const { docClient, tables } = require('../common/dynamodb');
const { v4: uuidv4 } = require('uuid');

class Diet {
  constructor(data) {
    this.id = data.id || uuidv4();
    this.title = data.title;
    this.description = data.description;
    this.shareId = data.shareId;
    this.isShared = data.isShared || false;
    this.userId = data.userId;
    this.created = data.created || new Date().toISOString();
    this.photo = data.photo || null;
  }

  static async create(dietData) {
    const diet = new Diet(dietData);
    const params = {
      TableName: tables.diets,
      Item: diet
    };

    await docClient.put(params).promise();
    return diet;
  }

  static async findById(id) {
    const params = {
      TableName: tables.diets,
      Key: { id }
    };

    const result = await docClient.get(params).promise();
    return result.Item ? new Diet(result.Item) : null;
  }

  static async findByUserId(userId) {
    const params = {
      TableName: tables.diets,
      IndexName: 'userId-index',
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      }
    };

    const result = await docClient.query(params).promise();
    return result.Items.map(item => new Diet(item));
  }

  static async findByShareId(shareId) {
    const params = {
      TableName: tables.diets,
      IndexName: 'shareId-index',
      KeyConditionExpression: 'shareId = :shareId',
      ExpressionAttributeValues: {
        ':shareId': shareId
      }
    };

    const result = await docClient.query(params).promise();
    return result.Items.length > 0 ? new Diet(result.Items[0]) : null;
  }

  static async findAll() {
    const params = {
      TableName: tables.diets
    };

    const result = await docClient.scan(params).promise();
    return result.Items.map(item => new Diet(item));
  }

  static async updateById(id, updateData) {
    const updateExpression = [];
    const expressionAttributeNames = {};
    const expressionAttributeValues = {};

    Object.keys(updateData).forEach((key, index) => {
      if (key !== 'id') {
        const attrName = `#attr${index}`;
        const attrValue = `:val${index}`;
        updateExpression.push(`${attrName} = ${attrValue}`);
        expressionAttributeNames[attrName] = key;
        expressionAttributeValues[attrValue] = updateData[key];
      }
    });

    const params = {
      TableName: tables.diets,
      Key: { id },
      UpdateExpression: `SET ${updateExpression.join(', ')}`,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: 'ALL_NEW'
    };

    const result = await docClient.update(params).promise();
    return new Diet(result.Attributes);
  }

  static async deleteById(id) {
    const params = {
      TableName: tables.diets,
      Key: { id }
    };

    await docClient.delete(params).promise();
    return { message: 'Diet successfully deleted' };
  }
}

module.exports = Diet;