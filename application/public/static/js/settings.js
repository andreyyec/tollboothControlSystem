$(function () {
    var scope, 
    body = $('body'),
    updateFareBtn = body.find('.fare-update'),
    updateFareField = body.find('.fare-input'),
    updateModal = body.find('#updateModal'),
    deleteModal = body.find('#deleteModal'),
    deleteModalUserTag = deleteModal.find('.usernames'),
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
        deleteUser: function() {
            $.ajax({
                type: 'POST',
                url: 'http://localhost:3000/rest/deleteuser',
                contentType: 'application/json',
                dataType: 'json',
                data: JSON.stringify({fare: nfare}),
                success: function(data){
                    console.log(data);
                    alert(data.msj);
                }
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
                        }
                    });
                } else {
                    alert('Invalid Fare value');
                }
            });

            body.on('click', '.update-user',function(e) {
                console.log($(e.target).parent().closest('tr')/*.find('td:first-child')*/);
                deleteModalUserTag.text();
                updateModal.modal('show');
            });
            
            body.on('click', '.delete-user',function(e) {
                let test = $(e.target).parent().closest('tr').find('td:nth-child(2)').text();
                console.log(test);
                deleteModalUserTag.text(test); 
                deleteModal.modal('show');
            });
    	},
    	init: function() {
    		scope = this;
            scope.requestUsers();
			scope.attachListeners();
    	}
    }
    usersManager.init();
});
