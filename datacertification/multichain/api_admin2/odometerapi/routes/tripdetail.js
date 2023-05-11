var express = require('express');
var router = express.Router();
var tripvalidationservice = require('../services/locationservices/tripvalidation');

/* GET users listing. */
router.post('', function(req, res, next) {
const body = req.body;

try{
    tripvalidationservice.getTripDetails(body,function(routeresponse){
    return res.status(201).json({routedetails:routeresponse});
  });
 
}
catch(err){
if(err){
  console.log(err);
  throw("Validation Error")
}
}
});

module.exports = router;
