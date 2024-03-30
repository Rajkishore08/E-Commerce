const express = require('express');
const bodyParser = require('body-parser');
const aws = require('aws-sdk');
const userRoutes = require('./controllers/userController');
const productRoutes = require('./controllers/productController');

const app = express();
app.use(bodyParser.json());

// AWS Configuration
aws.config.update({
  region: 'your-region',
  accessKeyId: 'your-access-key-id',
  secretAccessKey: 'your-secret-access-key'
});
const dynamoDB = new aws.DynamoDB.DocumentClient();

// Middleware
app.use((req, res, next) => {
  req.dynamoDB = dynamoDB;
  next();
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));
