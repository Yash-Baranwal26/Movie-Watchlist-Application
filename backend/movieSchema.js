const mongoose = require('mongoose')

const movieSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
    },
    reYear:{
        type:Number,
    },
    gnre:{
        type:String
    },
    movImg:{
        type:String
    }
})

const movieList = mongoose.model("movieSchema",movieSchema)

module.exports = movieList;