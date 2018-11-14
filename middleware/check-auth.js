const jwt = require('jsonwebtoken');

// Extract token and Check whther the token is valid
module.exports = (req, res, next) => {  
  try {
    const token = req.headers.authorization.split(' ')[1];  // There may be no token, which will cause error
    const decodedToken = jwt.verify(token, 'secret_this_should_be_longer');   // There will be error if it is not verified
    // Evert middlewaver after it can get the user information from req
    req.userData = { email: decodedToken.email, userId: decodedToken.userId }; 
    next(); // Let request continue
  } catch (error) {
    res.status(401).json({  // 401 for not authorized
      message: 'You are not authenticated!'
    });
  }
}