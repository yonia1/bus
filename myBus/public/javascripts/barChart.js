/**
 * Created by Yoni on 06/10/2015.
 * Display charts model
 *
 */
var charts=(function(){

    var displayBarChart=function(id,dataUrl)
    {
        var margin ={top:20, right:30, bottom:30, left:40},
            width=960-margin.left - margin.right,
            height=600-margin.top-margin.bottom;

// scale to ordinal because x axis is not numerical
        var x = d3.scale.ordinal().rangeRoundBands([0, width], .1);

//scale to numerical value by height
        var y = d3.scale.linear().range([height, 10]);

        var chart = d3.select("#"+id)
            .append("svg")  //append svg element inside #chart
            .attr("width", width+(2*margin.left)+margin.right)    //set width
            .attr("height", height+margin.top+margin.bottom);  //set height
        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom");  //orient bottom because x-axis will appear below the bars

        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left");
        /*Fetch the json file*/
        d3.json(dataUrl, function(error, data){

            x.domain(data.map(function(d){ return d.hour}));
            y.domain([0, d3.max(data, function(d){return d.count})]);

            var bar = chart.selectAll("g")
                .data(data)
                .enter()
                .append("g")
                .attr("transform", function(d, i){
                    return "translate("+x(d.hour)+", 0)";
                });

            bar.append("rect")
                .attr("y", function(d) {
                    return y(d.count);
                })
                .attr("x", function(d,i){
                    return x.rangeBand()+(margin.left/2);
                })
                .attr("height", function(d) {
                    return height - y(d.count);
                })
                .attr("width", x.rangeBand());  //set width base on range on ordinal data

            bar.append("text")
                .attr("x", x.rangeBand()+margin.left )
                .attr("y", function(d) { return y(d.count) -10; })
                .attr("dy", ".75em")
                .text(function(d) { return d.count; });

            chart.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate("+margin.right+","+ height+")")
                .call(xAxis)
                .append("text")
                // .attr("transform", "rotate(-90)")
                .attr("x", 6)
                .attr("xd", ".71em")
                .style("text-anchor", "end");
            //  .text("Hour");

            chart.append("g")
                .attr("class", "y axis")
                .attr("transform", "translate("+margin.left+",0)")
                .call(yAxis)
                .append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 6)
                .attr("dy", ".71em")
                .style("text-anchor", "end")
                .text("Frequency");
        });

    }

    return {
        displayBarChart:displayBarChart
    }
})();