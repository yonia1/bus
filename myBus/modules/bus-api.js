/**
 * Created by Yoni on 03/10/2015.
 */
var request = require('request');
var NodeCache = require( "node-cache" );
var conf = require('../configuration/config');
var myCache = new NodeCache( { stdTTL: conf.cacheEvicTime, checkperiod: 60 } );
var Q = require("q");
var HOURS_PER_DAY=24;

module.exports = {

    /*Get the number of buses per hour
    * Return a promise object of the result*/
    getBusFrequencyPerHour: function() {
        var deferred = Q.defer();
         var counter={};
        /*Serve from cache if stored else fetch and store */
        myCache.get( "counter", function( err, value ){
            if( !err ){
                if(value == undefined){
                    //Lets try to make a HTTPS GET request to modulus.io's website.

                    request(conf.busUrl, function (error, response, body) {
                        console.log("got for request");
                        //Check for error
                        if(error){
                            deferred.resolve( console.log('Error:', error));
                        }

                        //Check for right status code
                        if(response.statusCode !== 200){
                            deferred.resolve(  console.log('Invalid Status Code Returned:', response.statusCode));
                        }

                        //All is good. Print the body
                        console.log(body); // Show the HTML for the Modulus homepage.
                        /*Got the body now parse it */
                        var data = JSON.parse(body);
                        /*Init the counter*/
                        for(var i=0;i<HOURS_PER_DAY;i++)
                            counter[i.toString()]=0;
                       // console.log("start parse body");
                        for (var i = 0; i < data.length; i++) {
                            try {
                                var start = new Date(data[i].startTime).getHours();
                                //console.log("start time " + start);
                               // console.log("start time " + data[i].startTime);
                                var end = new Date(data[i].endTime).getHours();
                                for (var currTime = start; currTime <= end; currTime++) {
                                    if (counter[currTime])
                                        counter[currTime] += 1;
                                    else
                                        counter[currTime] = 1;
                                }
                            }
                            catch (e){
                                console.log(e);
                            }
                        }

                        var result=translteObejct2Array(counter);

                        myCache.set("counter", result, function (err, success) {
                            if (!err && success) {
                                console.log(success);

                            }
                        });
                        /*In case we need it in a different module */
                        myCache.set("fullData", body, function (err, success) {
                            if (!err && success) {
                                console.log(success);

                            }
                        })
                        deferred.resolve (result);

                    });

                }else{
                    console.log( value );
                    counter=value;
                    deferred.resolve (counter);
                }
            }
        });
        return deferred.promise;
    }

};
/*Translate the hours object to array*/
var translteObejct2Array=function(counter){
    var result=[];
    for (var prop in counter) {
        var obj={
            hour:prop,count:counter[prop]
        }

        result.push(obj);
    }
    return result;
}