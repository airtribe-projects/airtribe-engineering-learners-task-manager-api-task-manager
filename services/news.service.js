const axios = require('axios');
const cache = require('./cache');

const fetchNewsFromAPI = async (preferences) => {
  const { categories = [], languages = [], sources = [] } = preferences;

  const apiKey = process.env.NEWS_API_KEY;
  let query = categories.join(' OR ') || 'general';
  const lang = languages[0] || 'en';

  const cacheKey = `${query}-${lang}`;

  
  if (cache.has(cacheKey)) {
    console.log(' Returning news from cache:', cacheKey);
    return cache.get(cacheKey);
  }

  const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&language=${lang}&apiKey=${apiKey}`;

  try {
    const response = await axios.get(url);
    const articles = response.data.articles;

   
    cache.set(cacheKey, articles);
    console.log(' Fetched and cached news:', cacheKey);

    return articles;
  } catch (err) {
    console.error('Error fetching news:', err.response?.data || err.message);
    throw new Error('Failed to fetch news from NewsAPI');
  }
};

module.exports = { fetchNewsFromAPI };
