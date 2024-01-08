const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    title: {type: String, required: true},
    movies: [{
        title: {type: String, required: true},
        image: {type: String, required: true}
    }]
});

module.exports = new mongoose.model('Movie', movieSchema);