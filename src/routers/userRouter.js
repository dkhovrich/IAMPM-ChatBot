const express = require('express');
const asyncMiddleware = require('../middleware/asyncMiddleware');
const UserService = require('../services/userService');

const router = express.Router();

router.get('/', asyncMiddleware(async (req, res) => {
    const users = await UserService.getAll();
    res.send(users);
}));

router.post('/', asyncMiddleware(async (req, res) => {
    const { email, password } = req.body;
    await UserService.create(email, password);
    res.sendStatus(201);
}));

router.put('/:id', asyncMiddleware(async (req, res) => {
    await UserService.update(req.params.id, req.body);
    res.sendStatus(201);
}));

router.delete('/:id', asyncMiddleware(async (req, res) => {
    await UserService.delete(req.params.id);
    res.sendStatus(200);
}));

module.exports = router;