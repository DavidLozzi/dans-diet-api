# Dan's Diet - DynamoDB Migration

This application has been migrated from MongoDB to AWS DynamoDB.

## Setup

### Prerequisites
- Node.js installed
- AWS account with DynamoDB access
- AWS credentials configured

### Environment Variables
Set the following environment variables:

```bash
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
TABLE_PREFIX=dansdiet-
# Optional: for local development
DYNAMODB_ENDPOINT=http://localhost:8000
```

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up DynamoDB tables:
```bash
npm run setup-tables
```

3. Start the application:
```bash
npm start
```

## DynamoDB Tables

The application creates the following tables:

### Users Table
- Primary Key: `id` (String)
- Global Secondary Index: `email-index` on `email`
- Stores user information including authentication data

### Diets Table
- Primary Key: `id` (String)
- Global Secondary Index: `userId-index` on `userId`
- Global Secondary Index: `shareId-index` on `shareId`
- Stores diet information and sharing settings

### Foods Table
- Primary Key: `id` (String)
- Global Secondary Index: `userId-index` on `userId`
- Global Secondary Index: `dietId-index` on `dietId`
- Stores food items associated with diets

### Logs Table
- Primary Key: `id` (String)
- Global Secondary Index: `userId-index` on `userId`
- Stores application logs and user activities

## Migration Notes

- All MongoDB ObjectIds have been replaced with UUIDs
- Async/await pattern is used throughout for better error handling
- DynamoDB-specific indexes are created for efficient querying
- Table names are prefixed to avoid conflicts (configurable via TABLE_PREFIX)
- Pay-per-request billing mode is used for cost optimization

## Development

For local development with DynamoDB Local:
1. Download and run DynamoDB Local
2. Set `DYNAMODB_ENDPOINT=http://localhost:8000`
3. Run the setup script and start the application

## API Compatibility

The API endpoints remain the same, but the underlying data structure has been optimized for DynamoDB:
- All references to `_id` are now `id`
- Date fields are stored as ISO strings
- Complex nested objects are preserved as DynamoDB supports JSON documents