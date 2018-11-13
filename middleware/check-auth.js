const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];  // There may be no token, which will cause error
    jwt.verify(token, 'secret_this_should_be_longer');      // There will be error if it is not verified
    next(); // Let request continue
  } catch (error) {
    res.status(401).json({  // 401 for not authorized
      message: "Auth failed"
    });
  }
}