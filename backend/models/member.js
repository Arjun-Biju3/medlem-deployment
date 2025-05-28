const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const memberSchema = new Schema({
    member_id:{type: String, required: true, unique: true},
    firstName:{type:String,require:true},
    lastName:{type:String,require:true},
    email:{type:String,require:true,unique:true},
    username:{type:String,required:true},
    gender:{type:String,required:true},
    phone:{type:String,require:true},
    age:{type:String,required:true},
    password:{type:String,required:true,minlength:6},
    permission:{type:String,required:true,default:"member"},
    image: { type: String},
})

module.exports = mongoose.model('member',memberSchema);