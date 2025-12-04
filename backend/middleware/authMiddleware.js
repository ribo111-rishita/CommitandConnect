const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async function (req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ msg: 'Unauthorized' });
  }

  const token = auth.split(' ')[1];
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev_jwt_secret');
    const user = await User.findById(decoded.id).select('-passwordHash');

    if (!user) return res.status(401).json({ msg: 'Unauthorized' });

    req.user = user;
    req.userId = user._id.toString();

    next();
  } catch (err) {
    console.error('Auth middleware error', err);
    return res.status(401).json({ msg: 'Unauthorized' });
  }
};
