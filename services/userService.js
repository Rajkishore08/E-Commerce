async function registerUser(req, res) {
    const { username, email, password } = req.body;
    const params = {
      TableName: 'UsersTable',
      Item: {
        username,
        email,
        password
      }
    };
    try {
      await req.dynamoDB.put(params).promise();
      res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Failed to register user' });
    }
  }
  
  async function loginUser(req, res) {
    const { email, password } = req.body;
    const params = {
      TableName: 'UsersTable',
      Key: {
        email
      }
    };
    try {
      const user = await req.dynamoDB.get(params).promise();
      if (!user.Item || user.Item.password !== password) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      const token = jwt.sign({ userId: user.Item._id }, 'secretKey', { expiresIn: '1h' });
      res.json({ token });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Failed to login' });
    }
  }
  
  module.exports = { registerUser, loginUser };
  
