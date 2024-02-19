const {validationResult} = require('express-validator');
const Ranking = require('../models/ranking');

exports.getRankings = async(req, res, next) => {
    const title = req.params.title;

    try {
        const rankings = await Ranking.find();
        const populatedRankings = await Promise.all(rankings.map(ranking => ranking.populate('series creator')));
        
        return res.status(200).json({rankings: title === 'empty' ? populatedRankings.map(ranking => ranking.toObject({getters: true})) : populatedRankings.filter(ranking => ranking.title.toLowerCase().includes(title.toLowerCase())).map(ranking => ranking.toObject({getters: true}))});
    } catch(err) {
        return res.status(500).json({message: 'Getting rankings failed.'});
    }
};

exports.getRankingsById = async(req, res, next) => {
    const seriesId = req.params.seriesId;
    const title = req.params.title;

    try {
        const rankings = await Ranking.find({series: seriesId});
        const populatedRankings = await Promise.all(rankings.map(ranking => ranking.populate('series creator')));

        return res.status(200).json({rankings: title === 'empty' ? populatedRankings.map(ranking => ranking.toObject({getters: true})) : populatedRankings.filter(ranking => ranking.title.toLowerCase().includes(title.toLowerCase())).map(ranking => ranking.toObject({getters: true}))});
    } catch(err) {
        return res.status(500).json({message: 'Getting rankings failed.'});
    }
};

exports.getRankingById = async(req, res, next) => {
    const rankingId = req.params.rankingId;
    
    try {
        const ranking = await Ranking.findById(rankingId).populate('series creator');

        if (!ranking) {
            return res.status(404).json({message: 'Ranking not found.'});
        }

        return res.status(200).json({ranking: ranking.toObject({getters: true})});
    } catch(err) {
        return res.status(500).json({message: 'Getting ranking failed.'});
    }
};

exports.createRanking = async(req, res, next) => {
    const errors = validationResult(req);
    const seriesId = req.params.seriesId;
    const {title, ranking} = req.body;

    if (!errors.isEmpty()) {
        return res.status(422).json({message: `Title must be between 1 and 30 characters.`});
    }

    try {
        const createdRanking = new Ranking({title, series: seriesId, ranking, likes: [], dislikes: [], creator: req.userId});
        await createdRanking.save();
        return res.status(201).json({message: 'Ranking successfully created.'});
    } catch(err) {
        return res.status(500).json({message: 'Creating ranking failed.'});
    }
};

exports.updateRanking = async(req, res, next) => {
    const errors = validationResult(req);
    const rankingId = req.params.rankingId;
    const {title, ranking} = req.body;

    if (!errors.isEmpty()) {
        return res.status(422).json({message: `Title must be between 1 and 30 characters.`});
    }

    try {
        const existingRanking = await Ranking.findById(rankingId);
        existingRanking.title = title;
        existingRanking.ranking = ranking;
        await existingRanking.save();
        return res.status(200).json({message: 'Ranking successfully updated.'});
    } catch(err) {
        return res.status(500).json({message: 'Updating ranking failed.'});
    }
};

exports.deleteRanking = async(req, res, next) => {
    const rankingId = req.params.rankingId;

    try {
        const ranking = await Ranking.findById(rankingId);

        if (!ranking) {
            return res.status(404).json({message: 'Ranking not found.'});
        }

        await Ranking.findByIdAndDelete(rankingId);
        return res.status(200).json({message: 'Ranked successfully deleted.'});
    } catch(err) {
        return res.status(500).json({message: 'Deleting ranking failed.'});
    }
};

exports.likeRanking = async(req, res, next) => {
    const rankingId = req.params.rankingId;

    try {
        const ranking = await Ranking.findById(rankingId);

        if (!ranking) {
            return res.status(404).json({message: 'Liked cipher not found.'});
        }

        ranking.likes = [...ranking.likes, req.userId];
        await ranking.save();
        return res.status(200).json({message: 'Liking cipher succeeded'});
    } catch(err) {
        return res.status(500).json({message: 'Liking cipher failed'});
    }
};

exports.unlikeRanking = async(req, res, next) => {
    const rankingId = req.params.rankingId;

    try {
        const ranking = await Ranking.findById(rankingId);

        if (!ranking) {
            return res.status(404).json({message: 'Unliked cipher not found.'});
        }

        ranking.likes = ranking.likes.filter(like => like.toString() !== req.userId.toString());
        await ranking.save();
        return res.status(200).json({message: 'Unliking cipher succeeded.'});
    } catch(err) {
        return res.status(500).json({message: 'Unliking cipher failed.'});
    }
};

exports.dislikeRanking = async(req, res, next) => {
    const rankingId = req.params.rankingId;

    try {
        const ranking = await Ranking.findById(rankingId);

        if (!ranking) {
            return res.status(404).json({message: 'Disliked cipher not found.'});
        }

        ranking.dislikes = [...ranking.dislikes, req.userId];
        await ranking.save();
        return res.status(200).json({message: 'Disliking cipher succeeded.'});
    } catch(err) {
        return res.status(500).json({message: 'Disliking cipher failed.'});
    }
};

exports.undislikeRanking = async(req, res, next) => {
    const rankingId = req.params.rankingId;

    try {
        const ranking = await Ranking.findById(rankingId);

        if (!ranking) {
            return res.status(404).json({message: 'Undisliked cipher not found.'});
        }

        ranking.dislikes = ranking.dislikes.filter(dislike => dislike.toString() !== req.userId.toString());
        await ranking.save();
        return res.status(200).json({message: 'Undisliking cipher succeeded.'});
    } catch(err) {
        return res.status(500).json({message: 'Undisliking cipher failed.'});
    }
};
