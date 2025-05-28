const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const benefitsSchema = new Schema({
    benefit_id:{type: String, required: true, unique: true},
    name:{type:String,require:true},
    description:{type:String,require:true},
    time_interval:{type:String,require:true},
    org_id: { type: String, required: true },
    image: { type: String},
})

module.exports = mongoose.model('benefits',benefitsSchema);