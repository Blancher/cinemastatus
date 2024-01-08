const Movie = require('../models/movie');

exports.getMovieSeries = async(req, res, nex) => {
    try {
        const series = await Movie.find();
        return res.status(200).json({series: series.map(series => series.toObject({getters: true}))});
    } catch(err) {
        return res.status(500).json({message: 'Getting movie series faied.'});
    }
};

exports.getMovieSeriesById = async(req, res, next) => {
    const seriesId = req.params.seriesId;

    try {
        const series = await Movie.findById(seriesId);

        if (!series) {
            return res.status(404).json({message: 'Series not found.'});
        }

        return res.status(200).json({series: series.toObject({getters: true})});
    } catch(err) {
        return res.status(500).json({message: 'Getting movie series by id failed.'});
    }
}