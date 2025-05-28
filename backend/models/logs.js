const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const logSchema = new Schema({
    member_id: { type: String, required: true }, 
    org_id: { type: String, required: true },
    action: { type: String, required:true },
    company:{type:String,required:true},
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('logs', logSchema);

