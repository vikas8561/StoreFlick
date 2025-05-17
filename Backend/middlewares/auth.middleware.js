const jwt = require('jsonwebtoken');

const requireAuth = (req, res, next) => {
  const token = req.cookies.token;

  if(!token){
    return res.status(401).json({ msg: "Authorization token missing or malformed" });
  }
  
  try{
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    console.log(decoded);
    next();
  }catch(err){
    return res.status(401).json({ msg: "Invalid or expired token" });
  }
}

module.exports = {requireAuth};