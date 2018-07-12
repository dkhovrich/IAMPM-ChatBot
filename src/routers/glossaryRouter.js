const express = require('express');

const Glossary = require('../database/glossary');
const asyncMiddleware = require('../middleware/asyncMiddleware');

const router = express.Router();

router.get('/', asyncMiddleware(async (req, res) => {
    const items = await Glossary.find();
    res.send(items);
}));

router.get('/:id', asyncMiddleware(async (req, res) => {
    const item = await Glossary.findById(req.params.id);
    if (item) {
        res.send(item);
    } else {
        res.sendStatus(404);
    }
}));

router.post('/', asyncMiddleware(async (req, res) => {
    await Glossary.create(req.body);
    res.sendStatus(201);
}));

router.put('/:id', asyncMiddleware(async (req, res) => {
    await Glossary.updateOne({ _id: req.params.id }, req.body);
    res.sendStatus(201);
}));

router.delete('/:id', asyncMiddleware(async (req, res) => {
    await Glossary.deleteOne({ _id: req.params.id });
    res.sendStatus(200);
}));

module.exports = router;