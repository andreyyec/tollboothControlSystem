$(function () {
    var scope, 
    body = $('body'),
    updateFareBtn = body.find('.fare-update'),
    updateFareField = body.find('.fare-input'),
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
            updateFareBtn.on('click', function() {
                let nfare = updateFareField.val();
                if($.isNumeric(nfare)) {
                    $.ajax({
                        type: 'POST',
                        url: 'http://localhost:3000/rest/updatefare',
                        contentType: 'application/json',
                        dataType: 'json',
                        data: JSON.stringify({fare: nfare}),
                        success: function(data){
                            console.log(data);
                            alert(data.msj);
                            //console.log(data.);
                        }
                    });
                } else {
                    alert('Invalid Fare value');
                }
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
