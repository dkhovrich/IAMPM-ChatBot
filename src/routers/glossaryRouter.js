const express = require('express');
const asyncMiddleware = require('../middleware/asyncMiddleware');
const GlossaryService = require('../services/glossaryService');

const router = express.Router();

router.get('/', asyncMiddleware(async (req, res) => {
    const glossaries = await GlossaryService.getAll();
    res.send(glossaries);
}));

router.get('/:id', asyncMiddleware(async (req, res) => {
    const glossary = await GlossaryService.getById(req.params.id);
    res.send(glossary);
}));

router.post('/', asyncMiddleware(async (req, res) => {
    await GlossaryService.create(req.body);
    res.sendStatus(201);
}));

router.put('/:id', asyncMiddleware(async (req, res) => {
    await GlossaryService.update(req.params.id, req.body);
    res.sendStatus(201);
}));

router.delete('/:id', asyncMiddleware(async (req, res) => {
    await GlossaryService.delete(req.params.id);
    res.sendStatus(200);
}));

module.exports = router;