const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const billingSchema = new Schema({
    bill_id:{type:String,required:true,unique: true},
    name:{type:String,required:true},
    amount:{type:String,require:true},
    time_interval:{type:String,require:true,},
    org_id: { type: String, required: true },
})

module.exports = mongoose.model('billings',billingSchema);