const express = require('express');
const movieControllers = require('../controllers/movieControllers');

const router = express.Router();

router.get('/', movieControllers.getMovieSeries);
router.get('/:seriesId', movieControllers.getMovieSeriesById);

module.exports = router;