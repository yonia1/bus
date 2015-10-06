/**
 * Created by Yoni on 03/10/2015.
 * Main model of the application
 * Once the document is ready - display a bar chart of the bus frequency
 */
$( document ).ready(function() {

    charts.displayBarChart("chart","api/busPerHour");

});