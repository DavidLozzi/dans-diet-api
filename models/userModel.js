const { docClient, tables } = require('../common/dynamodb');
const { v4: uuidv4 } = require('uuid');

class User {
  constructor(data) {
    this.id = data.id || uuidv4();
    this.email = data.email;
    this.first_name = data.first_name;
    this.last_name = data.last_name;
    this.password = data.password;
    this.created = data.created || new Date().toISOString();
    this.permissions = data.permissions || 1; // Default to NORMAL permission
  }

  static async create(userData) {
    const user = new User(userData);
    const params = {
      TableName: tables.users,
      Item: user,
      ConditionExpression: 'attribute_not_exists(email)' // Prevent duplicate emails
    };

    try {
      await docClient.put(params).promise();
      return user;
    } catch (error) {
      if (error.code === 'ConditionalCheckFailedException') {
        throw new Error('User with this email already exists');
      }
      throw error;
    }
  }

  static async findById(id) {
    const params = {
      TableName: tables.users,
      Key: { id }
    };

    const result = await docClient.get(params).promise();
    return result.Item ? new User(result.Item) : null;
  }

  static async findByEmail(email) {
    const params = {
      TableName: tables.users,
      IndexName: 'email-index',
      KeyConditionExpression: 'email = :email',
      ExpressionAttributeValues: {
        ':email': email
      }
    };

    const result = await docClient.query(params).promise();
    return result.Items.length > 0 ? new User(result.Items[0]) : null;
  }

  static async findAll() {
    const params = {
      TableName: tables.users,
      ProjectionExpression: 'id, email, first_name, last_name, created, permissions'
    };

    const result = await docClient.scan(params).promise();
    return result.Items.map(item => new User(item));
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
      TableName: tables.users,
      Key: { id },
      UpdateExpression: `SET ${updateExpression.join(', ')}`,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: 'ALL_NEW'
    };

    const result = await docClient.update(params).promise();
    return new User(result.Attributes);
  }

  static async deleteById(id) {
    const params = {
      TableName: tables.users,
      Key: { id }
    };

    await docClient.delete(params).promise();
    return { message: 'User successfully deleted' };
  }
}

module.exports = User;