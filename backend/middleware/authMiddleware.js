const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async function (req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) {
    console.log("Auth Middleware: No Authorization header");
    return res.status(401).json({ msg: 'Unauthorized: No token' });
  }

  // Allow "Bearer " or "bearer "
  const parts = auth.split(' ');
  if (parts.length !== 2 || !/^Bearer$/i.test(parts[0])) {
    console.log("Auth Middleware: Invalid token format:", auth);
    return res.status(401).json({ msg: 'Unauthorized: Invalid token format' });
  }

  const token = parts[1];

  try {
    const secret = process.env.JWT_SECRET || "supersecret"; // Match auth.js fallback
    // console.log("Auth Middleware: Verifying with secret length:", secret.length); 

    const decoded = jwt.verify(token, secret);
    // console.log("Auth Middleware: Token decoded, User ID:", decoded.id);

    const user = await User.findById(decoded.id).select('-passwordHash');

    if (!user) {
      console.log("Auth Middleware: User not found for ID:", decoded.id);
      return res.status(401).json({ msg: 'Unauthorized: User not found' });
    }

    req.user = user;
    req.userId = user._id.toString();

    next();
  } catch (err) {
    console.error('Auth middleware error:', err.message);
    return res.status(401).json({ msg: 'Unauthorized: Invalid token' });
  }
};
