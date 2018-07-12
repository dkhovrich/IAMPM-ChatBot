const express = require('express');
const asyncMiddleware = require('../middleware/asyncMiddleware');
const UserService = require('../services/userService');

const router = express.Router();

router.post('/', asyncMiddleware(async (req, res) => {
    const { email, password } = req.body;
    await UserService.create(email, password);
    res.sendStatus(201);
}));

module.exports = router;