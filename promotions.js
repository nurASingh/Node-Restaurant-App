var mongoose = require('mongoose');
var Schema = mongoose.Schema;
require('mongoose-currency').loadType(mongoose);
var Currency = mongoose.Types.Currency;

var promotionalSchema = new Schema({
            name: {
                type: String,
                unique : true,
                required : true
            },
            image: {
                type : String ,
                required : true
            },
            label : {
                type : String,
                default : ""
            },
            price : {
                type: Currency,
                required : true
            },
            description: {
                type: String,
                required: true
            }
    });

var Promotions = mongoose.model('Promotion', promotionalSchema);
module.exports = Promotions;