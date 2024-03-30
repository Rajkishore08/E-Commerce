async function searchProducts(req, res) {
    const { query } = req.query;
    const params = {
      TableName: 'ProductsTable',
      FilterExpression: 'contains(name, :query)',
      ExpressionAttributeValues: { ':query': query }
    };
    try {
      const products = await req.dynamoDB.scan(params).promise();
      res.json(products.Items);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Failed to search products' });
    }
  }
  
  async function getProductCount(req, res) {
    const { productId } = req.params;
    const params = {
      TableName: 'ProductsTable',
      Key: {
        productId
      }
    };
    try {
      const product = await req.dynamoDB.get(params).promise();
      res.json({ count: product.Item.count });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Failed to get product count' });
    }
  }
  async function addToCart(req, res) {
    const { productId } = req.body;
    const userId = req.userId;
  
    // Get user's cart
    const getUserParams = {
      TableName: 'UsersTable',
      Key: {
        userId
      }
    };
  
    try {
      const user = await req.dynamoDB.get(getUserParams).promise();
      if (!user.Item) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Check if product exists
      const getProductParams = {
        TableName: 'ProductsTable',
        Key: {
          productId
        }
      };
  
      const product = await req.dynamoDB.get(getProductParams).promise();
      if (!product.Item || product.Item.count === 0) {
        return res.status(404).json({ message: 'Product not found or out of stock' });
      }
  
      // Add product to user's cart
      const updateParams = {
        TableName: 'UsersTable',
        Key: {
          userId
        },
        UpdateExpression: 'SET #cart = list_append(if_not_exists(#cart, :emptyList), :productId)',
        ExpressionAttributeNames: {
          '#cart': 'cart'
        },
        ExpressionAttributeValues: {
          ':productId': [productId],
          ':emptyList': []
        },
        ReturnValues: 'UPDATED_NEW'
      };
  
      await req.dynamoDB.update(updateParams).promise();
      res.status(200).json({ message: 'Product added to cart' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Failed to add product to cart' });
    }
  }
  
  async function proceedToBuy(req, res) {
    const userId = req.userId;
  
    // Get user's cart
    const getUserParams = {
      TableName: 'UsersTable',
      Key: {
        userId
      }
    };
  
    try {
      const user = await req.dynamoDB.get(getUserParams).promise();
      if (!user.Item) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Update product counts and empty cart
      const cart = user.Item.cart;
      const updatePromises = [];
  
      cart.forEach(productId => {
        const updateProductParams = {
          TableName: 'ProductsTable',
          Key: {
            productId
          },
          UpdateExpression: 'SET #count = #count - :decrement',
          ExpressionAttributeNames: {
            '#count': 'count'
          },
          ExpressionAttributeValues: {
            ':decrement': 1
          }
        };
        updatePromises.push(req.dynamoDB.update(updateProductParams).promise());
      });
  
      // Wait for all product count updates to complete
      await Promise.all(updatePromises);
  
      // Clear user's cart
      const clearCartParams = {
        TableName: 'UsersTable',
        Key: {
          userId
        },
        UpdateExpression: 'REMOVE cart'
      };
  
      await req.dynamoDB.update(clearCartParams).promise();
  
      res.status(200).json({ message: 'Proceeded to buy' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Failed to proceed to buy' });
    }
  }
  
  module.exports = { searchProducts, getProductCount, addToCart, proceedToBuy };
