const mongoose = require("mongoose");
const {Schema,model} = mongoose;

const userProfileSchema = new Schema({
    username : String,
    account_no : String,
    password : String,
    sid : String,
    email : String,
    created_at : String,
    amount : Number,
    loanAmount: Number,
}, {
    collection: 'user-profile'
});

const EntryModel = model('User' , userProfileSchema);

module.exports = EntryModel;
