const Schema = require('mongoose').Schema

const eventSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    date: {
        type: Date 
    }
})

module.exports = require('mongoose').model('Event', eventSchema)