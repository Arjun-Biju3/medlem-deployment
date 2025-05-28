const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const membershipSchema = new Schema({
    member_id: { type: String, required: true }, 
    org_id: { type: String, required: true },
    status: { type: Boolean, default: true },
    joined_date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('membership', membershipSchema);
