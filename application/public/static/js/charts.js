$(function () {
    var scope, 
    body = $('body'),
    chartsManager = {
    	attachListeners: function() {
		    
    	},
    	init: function() {
    		scope = this;
    		if (body.find('.content-container.dashboard').length > 0) {
    			scope.attachListeners();
    		}
    	}
    }
    chartsManager.init();
});
