const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const organizationSchema = new Schema({
    org_id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    address: { type: String, required: true },
    no_of_members: { type: Number, default: 0 },
    profile_image: { type: String},
    username:{type:String,required:true},
    password:{type:String,required:true},
    permission:{type:String,required:true,default:"organization"},
})

module.exports = mongoose.model('organization', organizationSchema);
