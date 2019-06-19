$(document).ready(function () {
    function Open(currentId) {
        $.ajax({
            type: "Get",
            url: '/UsersAdmin/Edit',
            data: { Id: currentId },
            success: function (data) {
                $console.log(data);
                $('#Preview').html(data);
                $('#myModal').modal('show');
                initializeEditView();
            }
        })
    }
   // function Retire(currentId) {
   //     $.ajax({
   //         type: "Get",
   //         url: '/UsersAdmin/Retire',
   //         data: { Id: currentId },
   //         success: function (data) {
   //             $('#PreviewRetire').html(data);
   //             $('#retiredModal').modal('show');                
   //         }
   //     })
   // }
    //$(".btnEdit").click(function (event) {
      //  Open(event.target.id);
    //});
    //$(".btnRetire").click(function (event) {
     //   var userId = event.target.id.substring(0, event.target.id.length - 1)
        //Retire(userId);
    //});

    
    function initializeEditView() {
        var dtInit = $('#GroupUpdatedDateTime').val();
        var groupInit = $('.selectpicker option:selected').val();
        $('.selectpicker').selectpicker('refresh')
        $('#chkUserStatus').change(function () {
            console.log($('#sendEmail').val());
            if ($('#sendEmail').val() == false | $('#sendEmail').val() == 'False' | $('#sendEmail').val() == 'false') {
                console.log('before click: ' + $('#sendEmail').val());
                $('#sendEmail').val(true);
                console.log('after click: ' + $('#sendEmail').val());
            } else {
                console.log('before click: ' + $('#sendEmail').val());
                $('#sendEmail').val(false); +
                $('#sendEmail').attr('data-val')
                console.log('after click: ' + $('#sendEmail').val());
            }
        });

        $('#groupSelect').on('change', function () {
            var dt = new Date();
            var datetime = dt.getMonth() + '/' + dt.getDay() + '/' + dt.getFullYear() + ' ' + dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds();

            if ($('.selectpicker option:selected').val() != groupInit) {
                console.log('yes');
                $('#GroupUpdatedDateTime').val(datetime);
            } else {
                $('#GroupUpdatedDateTime').val(dtInit);
            }


        });



        
    }
});