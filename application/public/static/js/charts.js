$(function () {
    var scope, 
    body = $('body'),
    baseUrl = 'http://localhost:3000/rest/getchartdata',
    chartsManager = {
        loadChartData: function(ctype, climit, callback) {  //Types: count, fare; limit: day, week, month, year 
            $.ajax({
                type: 'POST',
                url: baseUrl,
                contentType: 'application/json',
                dataType: 'json',
                data: JSON.stringify({type: ctype, limit: climit}),
                success: function(data){
                    callback(data);
                }
            });
        },
        initChart: function() {
            
            scope.loadChartData('count', 'day', function(data) {
                console.log('callback');
                console.log('Data from callback:');
                console.log(data);
            });
        },
        initCharts: function() {

            Morris.Line({
                // ID of the element in which to draw the chart.
                element: 'morris-line-chart-cars',
                // Chart data records -- each entry in this array corresponds to a point on
                // the chart.
                data: [{
                    date: '2012-10-01',
                    cars: 802
                }, {
                    date: '2012-10-29',
                    cars: 1420
                }, {
                    date: '2012-10-30',
                    cars: 1529
                }, {
                    date: '2012-10-31',
                    cars: 1892
                }, ],
                // The name of the data record attribute that contains x-visitss.
                xkey: 'date',
                // A list of names of data record attributes that contain y-visitss.
                ykeys: ['cars'],
                // Labels for the ykeys -- will be displayed when you hover over the
                // chart.
                labels: ['Car Count'],
                // Disables line smoothing
                smooth: false,
                resize: true
            });

            Morris.Line({
                // ID of the element in which to draw the chart.
                element: 'morris-line-chart-fares',
                // Chart data records -- each entry in this array corresponds to a point on
                // the chart.
                data: [{
                    date: '2012-10-01',
                    fares: 802
                }, {
                    date: '2012-10-29',
                    fares: 1420
                }, {
                    date: '2012-10-30',
                    fares: 1529
                }, {
                    date: '2012-10-31',
                    fares: 1892
                }, ],
                // The name of the data record attribute that contains x-visitss.
                xkey: 'date',
                // A list of names of data record attributes that contain y-visitss.
                ykeys: ['fares'],
                // Labels for the ykeys -- will be displayed when you hover over the
                // chart.
                labels: ['Total Fares'],
                // Disables line smoothing
                smooth: false,
                resize: true
            });
        },
    	attachListeners: function() {
		    
    	},
    	init: function() {
    		scope = this;
            scope.initChart();
    		scope.initCharts();
    	}
    }
    chartsManager.init();
});
