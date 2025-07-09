const { docClient, tables } = require('../common/dynamodb');
const { v4: uuidv4 } = require('uuid');

class Food {
  constructor(data) {
    this.id = data.id || uuidv4();
    this.userId = data.userId;
    this.dietId = data.dietId;
    this.name = data.name;
    this.category = data.category;
    this.notes = data.notes;
    this.restriction = data.restriction;
    this.alternativeId = data.alternativeId;
    this.created = data.created || new Date().toISOString();
    this.modified = data.modified || new Date().toISOString();
  }

  static async create(foodData) {
    const food = new Food(foodData);
    const params = {
      TableName: tables.foods,
      Item: food
    };

    await docClient.put(params).promise();
    return food;
  }

  static async findById(id) {
    const params = {
      TableName: tables.foods,
      Key: { id }
    };

    const result = await docClient.get(params).promise();
    return result.Item ? new Food(result.Item) : null;
  }

  static async findByUserId(userId) {
    const params = {
      TableName: tables.foods,
      IndexName: 'userId-index',
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      }
    };

    const result = await docClient.query(params).promise();
    return result.Items.map(item => new Food(item));
  }

  static async findByDietId(dietId) {
    const params = {
      TableName: tables.foods,
      IndexName: 'dietId-index',
      KeyConditionExpression: 'dietId = :dietId',
      ExpressionAttributeValues: {
        ':dietId': dietId
      }
    };

    const result = await docClient.query(params).promise();
    return result.Items.map(item => new Food(item));
  }

  static async findAll() {
    const params = {
      TableName: tables.foods
    };

    const result = await docClient.scan(params).promise();
    return result.Items.map(item => new Food(item));
  }

  static async updateById(id, updateData) {
    updateData.modified = new Date().toISOString();
    
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
      TableName: tables.foods,
      Key: { id },
      UpdateExpression: `SET ${updateExpression.join(', ')}`,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: 'ALL_NEW'
    };

    const result = await docClient.update(params).promise();
    return new Food(result.Attributes);
  }

  static async deleteById(id) {
    const params = {
      TableName: tables.foods,
      Key: { id }
    };

    await docClient.delete(params).promise();
    return { message: 'Food successfully deleted' };
  }
}

module.exports = Food;