$(function () {
    var scope, 
    socket = io(),
    body = $('body'),
    usersManager = {
        requestUsers: function() {
            //$.get();
        },
    	attachListeners: function() {
		    body.find('.update-fare').on('click', function() {
                console.log('Update Request');
            });
    	},
    	init: function() {
    		scope = this;
    		if (body.find('.content-container.settings').length > 0) {
    			scope.attachListeners();
    		}
    	}
    }
    usersManager.init();
});
