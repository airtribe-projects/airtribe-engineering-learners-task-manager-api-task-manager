const express = require('express');
const router = express.Router();
const {registerNewUser, loginUser} = require('../controllers/user.controller');
const { users } = require('../controllers/user.controller');

router.use(express.json());

// registration endpoint
router.post('/register', async (req,res) => {
    const user = req.body;
    const appUser = await registerNewUser(user);

    return res.send(appUser);
});

// login user
router.post('/login', async(req,res) => {
    const {email, password} = req.body;

    const response = await loginUser(email,password)
    return res.send(response);
})

// getAllUsers 
router.get('/users', (req,res) => {
    res.send(users)
})

module.exports = router;