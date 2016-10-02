var express = require('express') , router = express.Router();
var bodyParser = require('body-parser');

var mongoose = require('mongoose');
var ObjectId = require('mongodb').ObjectID;

var Favorites = require('../models/favorites.js');

var Verify = require('./verify');

router.use(bodyParser.json());    
router.use('/', Verify.verifyOrdinaryUser); 

router.route('/')
    .get(Verify.verifyOrdinaryUser, function(req, res, next){
        req.body.postedBy = req.decoded._doc._id;
        Favorites.find({postedBy : req.body.postedBy})
        .populate('postedBy')
        .populate('dishes')
        .exec(function(err, result){
            if (err) throw err;
            
            res.json(result);
        });
    })
    .post(Verify.verifyOrdinaryUser, function(req, res, next){
        req.body.postedBy = req.decoded._doc._id;        
        Favorites.findOne({postedBy : req.body.postedBy}, function(err, doc){
          if(doc)
          {
                console.log('Other Favorites found for user ' + req.body.postedBy);
                Favorites.findOne({ postedBy : req.body.postedBy, dishes: {"_id": req.body._id}}, {"dishes.$" : 1}, function(err, dish){
                    if(dish)
                    {
                        console.log('Dish already exists in user favorites');
                        res.writeHead(200, {'Content-Type' : 'text/plain'});
                        res.end('Dish already exists in user favorites.');   
                    }
                    else{
                       //throw err;
                       doc.dishes.push(req.body._id);
                        doc.save(function(err, dish){
                           if(err) throw err; 
                             console.log('New dish Added to user favorites ' + dish);    
                             res.json(doc);               
                        });
                        
                    }
                });          
          }
          else
          {
              console.log('No other Favorites for user ' + req.body.postedBy);
              
              Favorites.create({postedBy: req.body.postedBy, dishes: [req.body._id]}, function(err, result){  
                if(err) throw err;
                
                console.log('Favorites List Created with new favorite!');
                var id = result._id;
                res.writeHead(200, {'Content-Type' : 'text/plain'});
                res.end('Favorite Created with id ' + id);                
              });
          }                
        });
    })
    .delete(Verify.verifyOrdinaryUser, function(req, res, next){              
            
        Favorites.remove({postedBy : req.decoded._doc._id}, function(err, result){
            if(err) throw err;
            
            console.log('All User Favorites Removed!');
            res.json(result);
        });
        
    });
    
router.route('/:dishId')    
    .delete(Verify.verifyOrdinaryUser, function(req, res, next){
        req.body.postedBy = req.decoded._doc._id;
        Favorites.findOne({ postedBy : req.body.postedBy}, function(err, fav){
            if (err) return next(err);           
                        
            Favorites.findOne({ postedBy : req.body.postedBy, dishes: {"_id": req.params.dishId}}, {"dishes.$" : 1}, function(err, dish){
                if(dish){
                    console.log('Dish found in user favorites');
                    Favorites.update( {postedBy : req.body.postedBy}, { $pull: {"dishes": req.params.dishId } }, function(err){
                        if (err) throw err;
                        
                        console.log('Dish Removed from Favorites ' + req.params.dishId);
                        res.writeHead(200, {'Content-Type' : 'text/plain'});
                        res.end('Dish Removed from Favorites ' + req.params.dishId);
                    } );  
                }
                else{
                    console.log('Dish not found in user favorites');                    
                    res.writeHead(403, {'Content-Type' : 'text/plain'});
                    res.end('Dish not found in user favorites'); 
                }
            });
        });   
        
    });
    
    
module.exports = router;
