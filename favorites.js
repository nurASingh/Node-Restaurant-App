var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var favoriteSchema = new Schema({    
    postedBy:  {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    dishes: [{
    	type: Schema.Types.ObjectId, 
    	ref: 'Dish', required: true 
    }]
}, {
    timestamps: true
});

var Favorites = mongoose.model('Favorite', favoriteSchema);

module.exports = Favorites;