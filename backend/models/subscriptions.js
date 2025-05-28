const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const subscriptionSchema = new Schema({
    sub_id:{type: String, required: true, unique: true},
    name:{type:String,require:true},
    time_interval:{type:String,require:true,},
    org_id: { type: String, required: true },
    image: { type: String},
})

module.exports = mongoose.model('subscriptions',subscriptionSchema);