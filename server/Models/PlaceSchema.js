const mongoose = require('mongoose');

const PlaceSchema = new mongoose.Schema({
    owner:{type:mongoose.Schema.Types.ObjectId,ref:'User'},
    title: { type: String, required: true },
    address:{type:String, required:true},
    photos:[String],
    description:String,
    perks:[String],
    extraInfo:String,
    checkIn:Number,
    checkOut:Number,
    maxGuest:Number,

})

module.exports = mongoose.model('Place',PlaceSchema);