const mongoose = require('mongoose');
const { required } = require('nodemon/lib/config');
const Schema = mongoose.Schema;

const Post = new Schema({
    alert:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    contents:{
        type: String,
        required: true
    },
    user:{
        type: Schema.Types.ObjectId,
        ref: "new_user",
        required: true
    },
    date:{
        type: Date,
        default: Date.now()
    }
})

mongoose.model("postages", Post)