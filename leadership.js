var mongoose = require('mongoose');
var Schema = mongoose.Schema;
require('mongoose-currency').loadType(mongoose);


var leadershipSchema = new Schema({
     name: {
         type : String,
         unique : true,
         required : true
      },
      image: {
          type : String,
          required : true
      },
      designation: {
          type : String,
          required : true
      },
      abbr: {
          type : String,
          required : true
      },
      description: {
          type : String,
          required : true
      }
});

var Leadership = mongoose.model('leadership', leadershipSchema);
module.exports = Leadership;