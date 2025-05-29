const cache = require('./cache');
const { fetchNewsFromAPI } = require('./news.service');
const User = require('../models/user.model');

const updateAllCachedNews = async () => {
  const allUsers = await User.find();

  for (const user of allUsers) {
    const key = JSON.stringify(user.preferences || {});
    const articles = await fetchNewsFromAPI(user.preferences || {});
    cache.set(key, articles); 
  }

  console.log(' News cache updated for all users');
};


setInterval(updateAllCachedNews, 15 * 60 * 1000);
