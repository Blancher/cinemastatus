const express = require('express');
const {check} = require('express-validator');
const rankingControllers = require('../controllers/rankingControllers');
const checkAuth = require('../middleware/checkAuth');

const router = express.Router();

router.get('/:title', rankingControllers.getRankings);
router.get('/:seriesId/:title', rankingControllers.getRankingsById);
router.get('/:rankingId', rankingControllers.getRankingById);
router.use(checkAuth);
router.post('/:seriesId', [check('title').isLength({min: 1, max: 30})], rankingControllers.createRanking);
router.patch('/:rankingId', [check('title').isLength({min: 1, max: 30})], rankingControllers.updateRanking);
router.delete('/:rankingId', rankingControllers.deleteRanking);
router.patch('/like/:rankingId', rankingControllers.likeRanking);
router.patch('/unlike/:rankingId', rankingControllers.unlikeRanking);
router.patch('/dislike/:rankingId', rankingControllers.dislikeRanking);
router.patch('/undislike/:rankingId', rankingControllers.undislikeRanking);

module.exports = router;
