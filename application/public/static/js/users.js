$(function () {
    var scope, 
    socket = io(),
    body = $('body'),
    usersManager = {
        processUserData: function(data) {
            $.each(data, function( index, object ) {
                data[index].actions = '<button type="button" data-id="'+object._id+'" class="btn btn-sm btn-primary update-user">Update</button> <button type="button" data-id="'+object._id+'" class="btn btn-sm btn-danger delete-user">Delete</button>';
            });
            return data;
        },
        requestUsers: function() {
            $.get( "http://localhost:3000/rest/getusers", function( json ) {
                var users = scope.processUserData(json.data);

                $('#userstable').DataTable( {
                    data: users,
                    columns: [
                        {data: 'name'},
                        {data: 'username'},
                        {data: 'state'},
                        {data: 'actions'}
                    ]
                });
            });
        },
    	attachListeners: function() {
		    body.find('.update-fare').on('click', function() {
                console.log('Update Request');
            });
    	},
    	init: function() {
    		scope = this;
    		if (body.find('.content-container.settings').length > 0) {
                scope.requestUsers();
    			scope.attachListeners();
    		}
    	}
    }
    usersManager.init();
});
