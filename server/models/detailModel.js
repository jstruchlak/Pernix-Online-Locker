const mongoose = require('mongoose');

const Schema = mongoose.Schema
// parsing 2 arguments (schema and timestamp)
const detailSchema = new Schema({
    fullName: {
        type: String,
        required: true
    },
    dob: {
        type: Date,
        required: true
    },
    aboutMe: {
        type: String,
        required: true
    },
    profilePic: {
        type: String, 
        required: true
    },

    // for document assignment (assigning profiles)
    user_id: {
        type: String,
        required: true
    }
}, 


{ timestamps: true})

// db model as 'Detail' within this model retrieve the detailSchema (schema = structure) (model = model fo the structure)
module.exports = mongoose.model('Detail', detailSchema)