$(function () {
    var scope, 
    socket = io(),
    body = $('body'),
    socketManager = {
    	updateDate: function () {
    		console.log('executing update');
    	},
    	attachListeners: function() {
		    socket.on('counterUpdate', function(msg){
		      	scope.updateDate();
		    });
    	},
    	init: function() {
    		scope = this;
    		if (body.find('.content-container.dashboard').length > 0) {
    			scope.attachListeners();
    		}
    	}
    }
    socketManager.init();
});
