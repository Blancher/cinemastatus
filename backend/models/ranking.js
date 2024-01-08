const mongoose = require('mongoose');

const rankingSchema = new mongoose.Schema({
    title: {type: String, required: true},
    series: {type: mongoose.Types.ObjectId, ref: 'Movie', required: true},
    ranking: [{
        title: {type: String, required: true},
        image: {type: String, required: true}
    }],
    likes: [{type: mongoose.Types.ObjectId, ref: 'User', required: true}],
    dislikes: [{type: mongoose.Types.ObjectId, ref: 'User', required: true}],
    creator: {type: mongoose.Types.ObjectId, ref: 'User', required: true}
});

module.exports = mongoose.model('Ranking', rankingSchema);