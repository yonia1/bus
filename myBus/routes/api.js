/**
 * Created by Yoni on 02/10/2015.
 */
var express = require('express');
var router = express.Router();

var busapi = require('../modules/bus-api');


/*Get API*/
router.get('/busPerHour/', function(req, res) {
    busapi.getBusFrequencyPerHour().then(function(data){
        //console.log("got result from bus-api");
        //console.log(data);
        res.json(data);

    })




});
module.exports = router;
