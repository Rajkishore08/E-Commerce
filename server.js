const express = require('express');
const bodyParser = require('body-parser');
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient } = require("@aws-sdk/lib-dynamodb");
const userRoutes = require('./controllers/userController');
const productRoutes = require('./controllers/productController');

const app = express();
app.use(bodyParser.json());

// AWS Configuration
const awsConfig = {
    region: 'ap-south-1',
    endpoint: 'http://dynamodb.ap-south-1.amazonaws.com',
    credentials: {
        accessKeyId: '---',
        secretAccessKey:'---'
};
const dynamoDBClient = new DynamoDBClient(awsConfig);
const dynamoDB = DynamoDBDocumentClient.from(dynamoDBClient);

// Middleware to attach DynamoDB client to request object
app.use((req, res, next) => {
  req.dynamoDB = dynamoDB;
  next();
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));
