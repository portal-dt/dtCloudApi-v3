export const verifyToken = (req, res, next) => {
  // Get auth header value
  const bearerHeader = req.headers['Authorization'] || req.headers['authorization'];

  if (bearerHeader) {
    const bearer = bearerHeader.split(' ');
    const [ , bearerToken ] = bearer;

    req.token = bearerToken;

    next();
  } else {
    res.status(403).json({ message: 'Invalid Access token provided!' });
  }
};
