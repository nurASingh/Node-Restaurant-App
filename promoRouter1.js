    var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var Verify = require('../routes/verify');
var hostname = 'localhost';
var port = 3000;

var app = express();

app.use(morgan('dev'));

var promoRouter = express.Router();

promoRouter.use(bodyParser.json());

promoRouter.route('/')
.all(function(req,res,next) {
      //res.writeHead(200, { 'Content-Type': 'text/plain' });
      next();
})

.get(Verify.verifyOrdinaryUser,function(req,res,next){
        res.end('Will send all the promotions to you!');
})

.post(Verify.verifyOrdinaryUser,Verify.verifyAdmin,function(req, res, next){
    console.log('Posting');
    res.end('Will add the promotion: ' + req.body.name + ' with details: ' + req.body.description);    
})

.delete(Verify.verifyOrdinaryUser,Verify.verifyAdmin,function(req, res, next){
        res.end('Deleting all promotions');
});

promoRouter.route('/:promotions')
.all(function(req,res,next) {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      next();
})

.get(Verify.verifyOrdinaryUser,function(req,res,next){
        res.end('Will send details of the promotion: ' + req.params.promotionId +' to you!');
})

.put(Verify.verifyOrdinaryUser,Verify.verifyAdmin,function(req, res, next){
        res.write('Updating the promotion: ' + req.params.promotionId + '\n');
    res.end('Will update the promotion: ' + req.body.name + 
            ' with details: ' + req.body.description);
})

.delete(Verify.verifyOrdinaryUser,Verify.verifyAdmin,function(req, res, next){
        res.end('Deleting promotion: ' + req.params.promotionId);
});



module.exports = promoRouter;