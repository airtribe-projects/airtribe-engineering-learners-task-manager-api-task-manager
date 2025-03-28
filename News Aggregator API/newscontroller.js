const axios = require("axios");
const User = require("../models/User");

exports.getNews = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        const categories = user.preferences.length > 0 ? user.preferences.join(",") : "general";

        const response = await axios.get(`https://newsapi.org/v2/top-headlines?category=${categories}&apiKey=${process.env.NEWS_API_KEY}`);

        res.json(response.data.articles);
    } catch (error) {
        res.status(500).json({ error: "Error fetching news" });
    }
};
