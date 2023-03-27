const express = require('express');
const router = express.Router();

const controleurs = require('../controleurs/logique_metiers');

router.get('/', controleurs.searchShooesSraping)

module.exports = router;