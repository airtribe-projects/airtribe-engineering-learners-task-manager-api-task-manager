var jwt = require('jsonwebtoken');
  
 const authenticater = async function (req, res, next) {

    if (!req.headers['authorization']) {
        return res.sendStatus(401); // Unauthorized
    }

    const decoded = jwt.verify(req.headers['authorization'], 'SECRET_KEY')

   if(decoded) {
    req.user = decoded
    next()
   } else {
    res.sendStatus(401);
   }
    
  }

  module.exports = authenticater