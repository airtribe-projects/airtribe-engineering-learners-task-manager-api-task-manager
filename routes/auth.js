const express = require('express');
const users = require("../models/userModal")

const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');


const router = express.Router();


// Implement GET /Login: To Login user.

router.get('/login', (req, res) => {
    const { username, password } = req.body

    if (!username || !password) res.status(400).send({ message: 'Invalid Request Parameter!.' })


    const index = users.findIndex(task => task.username == username);


    if (index === -1) {
        return res.status(404).send({ message: 'User not found' });
    }

    console.log(password, users[index].password,'asdasdsad')

    if (!bcrypt.compareSync(password, users[index].password)) {
        return res.status(404).send({ message: 'Invalid Credentials' });
    }

    const user = users.filter((obj) => obj.username == username)

    var token = jwt.sign(user[0], 'SECRET_KEY',{ expiresIn: 60 * 60 });

    res.status(200).send({
        msg: 'User Authenticated Successfully',
        token 
    })

})



module.exports = router;