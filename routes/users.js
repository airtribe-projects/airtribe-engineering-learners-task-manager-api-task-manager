const express = require('express');
const users = require("../models/userModal")

const bcrypt = require('bcrypt');
const authenticater = require('../middlewares/authenticater');

const router = express.Router();


// Implement GET /users/:username: Retrieve a specific user by its username.

router.get('/users/:username', (req, res) => {
    const { username } = req.params

    if (!username) res.status(400).send({ message: 'Invalid Request Parameter!.' })


    const index = users.findIndex(task => task.username == username);

    if (index === -1) {
        return res.status(404).send({ message: 'User not found' });
    }

    res.send(users.filter((obj) => obj.username == username))
})

// Implement POST /users: Create a new user with the required fields (username, email, password).

router.post('/users', (req, res) => {

    const { username, email, password } = req.body

    if (!username || !password || !email) res.status(400).send({ message: 'Invalid Request Parameter!.' })

    regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!regex.test(email)) return res.status(400).send({ message: 'Please enter a valid email' })

    const index = users.findIndex(task => task.username == username);

    if (index !== -1) return res.status(400).send({ message: 'username already exists' })

    if (password.length <= 7) return res.status(400).send({ message: 'Password should contain minimum of 8 characters' })


    const saltRounds = 10;
    const hashedPassword = bcrypt.hashSync(password, saltRounds);

    users.push({
        ...req.body,
        password: hashedPassword,
        id: users.length + 1,
        preferance: 'all categories', //by default
        cd: new Date(),
    })

    res.status(201).send(req.body)
})


// Implement GET /preferences: Retrieve a preferences for a user.

router.get('/preferences', authenticater, (req, res) => {

    const { preferance } = req.user

    res.send({ msg: 'success', preferance })

})

// Implement PUT /preferences: update a preferences for a user.


router.put('/preferences', authenticater, (req, res) => {


    console.log(req.body, '<<<odyyy')
    const { username } = req.user
    const { preferance } = req.body

    if (!preferance) res.status(400).send({ message: 'Invalid Request Parameter!.' })

    users.forEach((obj, idx) => {
        if (obj.username == username) {
            finalObj = {
                ...obj,
                preferance
            }
            users[idx] = { ...finalObj }
        }
    })


    res.send({ msg: 'successfully updated', obj: users.filter((obj, idx) => obj.username == username)[0] })

})

module.exports = router;