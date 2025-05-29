const express = require('express');
const axios = require('axios');


const authenticater = require('../middlewares/authenticater');


const router = express.Router();


// Implement GET /news: Retrieve news.

router.get('/news', authenticater, async (req, res) => {

    const { preferance } = req.user

    if (!preferance) res.status(400).send({ message: 'Invalid Request Parameter!.' })

    const API_KEY = '21df9cab9bea467185df1c81de1300cf'

    axios.get(`https://newsapi.org/v2/top-headlines/sources?category=${preferance}&apiKey=${API_KEY}`, {
        apiKey : API_KEY
    })
    .then((res)=>{
        res.send({msg: 'success', news: res.data?.sources})
    })
    .catch((res)=>{
        res.send({msg: 'failed', news: []})

    })
})



module.exports = router;