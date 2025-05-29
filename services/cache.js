const NodeCache = require('node-cache');
const newsCache = new NodeCache({ stdTTL: 15 * 60 }); 
module.exports = newsCache;
