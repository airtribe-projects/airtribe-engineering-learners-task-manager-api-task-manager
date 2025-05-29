const logRequest = (req, res, next) => {
  console.log(`Request Log: ${req.method}: Request on ${req.url}`);
  next();
};

module.exports = {logRequest};