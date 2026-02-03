const mongoose =require('mongoose');
require('dotenv').config()


const mongoDB = process.env.MONGO_URI;
const connection = mongoose.connect(mongoDB)


module.exports = {connection};