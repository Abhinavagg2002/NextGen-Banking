const mongoose = require("mongoose");
const {Schema,model} = mongoose;



const transSchema = new Schema({
    account_no : String,
    history : [
        {
            date : {type:String},
            type : {type:String},
            amount : {type:Number}
        }
    ],

}, {
    collection: 'transactions'
});

const EntryModel = model('Trans' , transSchema);

module.exports = EntryModel;
