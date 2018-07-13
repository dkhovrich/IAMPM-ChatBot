const express = require('express');
const jwt = require('jsonwebtoken');

const UserService = require('../services/userService');
const jwtSecretKey = require('../config').jwtSecretKey;
const router = express.Router();

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await UserService.login(email, password);
        const token = jwt.sign(user, jwtSecretKey);
        res.json({ token });
    } catch (err) {
        console.error('Login error', err);
        res.sendStatus(401);
    }
});

module.exports = router;