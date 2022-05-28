const mongoose = require('mongoose')

const animeSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        _id : false
    },
    characters: [{
        name: {
            type: String,
            required: false,
            trim: true,
            _id : false
        },
        image: {
            type: String,
            required: false,
            trim: true,
            _id : false
        }, 
        url: {
            type: String,
            required: false,
            _id : false
        },
        favorites: {
            type: Number,
            required: false,
            _id : false
        }
    }],
    id: {
        type: String,
        required: true,
        trim: true,
        _id : false
    },
    image: {
        type: String,
        required: false,
        _id : false
    }, 
    score: {
        type: Number,
        required: false,
        _id : false
    }, 
    rank: {
        type: Number,
        required: false,
        _id : false
    }, 
    popularity: {
        type: Number,
        required: false,
        _id : false
    }, 
    members: {
        type: Number,
        required: false,
        _id : false
    },
    prequel: {
        type: String,
        required: false,
        _id : false
    }
})

animeSchema.index({ title: 'text' });
const Anime = mongoose.model('Anime', animeSchema)
Anime.createIndexes()

module.exports = Anime