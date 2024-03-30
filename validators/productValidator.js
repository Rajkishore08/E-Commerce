function validateProduct(req, res, next) {
    const { name, price, description, count } = req.body;
    if (!name || !price || !description || !count) {
      return res.status(400).json({ message: 'Name, price, description, and count are required for product creation' });
    }
    if (typeof price !== 'number' || price <= 0) {
      return res.status(400).json({ message: 'Price must be a positive number' });
    }
    if (typeof count !== 'number' || count < 0) {
      return res.status(400).json({ message: 'Count must be a non-negative number' });
    }
    next();
  }
  
  module.exports = { validateProduct };
  
