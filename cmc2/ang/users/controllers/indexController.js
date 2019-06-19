(function (app) {
    var indexController = function ($scope, $log, $http, userRole, userGroup, userName) {        
        $scope.initialize = function (users) {
            
            var activeElement = angular.element(document.querySelector('.active'));
            activeElement.removeClass('active');
            var menuManageElement = angular.element(document.querySelector('#menuManage'));
            $log.log(menuManageElement);
            menuManageElement.addClass('active');
            $scope.reverse = true;            
            $scope.users = [];
            $log.log()
            $log.log(users);
            $scope.userName = userName;
            $scope.userGroupName = userGroup;
            if(userRole == "Coordinator"|userRole == "Monitor"){
                $scope.isMonitorOrCoordinator = true;
            } else {
                $scope.isMonitorOrCoordinator = false;
            }
            angular.forEach(users, function (value, key) {
                
                var statusOrder;
                if (value.Status == true) {
                    statusOrder = 1;
                } else if (value.Status == false && value.HasBeenActivated == false && value.EmailConfirmed == true) {
                    statusOrder = 0;
                } else if (value.Status == false && value.HasBeenActivated == true && value.EmailConfirmed == true) {
                    statusOrder = 2;
                } else if (value.EmailConfirmed == false) {
                    statusOrder = 3;
                } 
                var user = {
                    Code: value.Code,                    
                    Id: value.Id,
                    FirstName: value.FirstName,
                    LastName: value.LastName,
                    Email: value.Email,
                    GroupName: value.Group.Name,
                    State: value.State,
                    Status: value.Status,
                    HasBeenActivated: value.HasBeenActivated,
                    Role: value.Role,
                    CreatedDate: value.CreatedDate,
                    ModifiedDate: value.ModifiedDate,
                    EmailConfirmed: value.EmailConfirmed,
                    StatusOrder: statusOrder
                };
                $scope.users.push(user);
            });

            $scope.usersDownload = [];
            angular.forEach($scope.users, function (value, index) {
                var downloadUser = {
                    Code: value.Code,
                    FirstName: value.FirstName,
                    LastName: value.LastName,
                    Email: value.Email,
                    GroupName: value.GroupName,
                    State: value.State,
                    Status: value.Status,
                    HasBeenActivated: value.HasBeenActivated,
                    Role: value.Role,
                    EmailConfirmed: value.EmailConfirmed
                };
                
                $scope.usersDownload.push(downloadUser);
            })
            $scope.headers = [];
            angular.forEach($scope.usersDownload[0], function (value, index) {
                $scope.headers.push(index);
            })
            $log.log('usersDownload');
            $log.log($scope.headers);
            $log.log($scope.usersDownload);
            $scope.sort('StatusOrder');
            //$scope.users = users.Result;
        };

        $scope.getButtonText = function getButtonText(usr) {
            var btnText = '';
            if (usr.Status == true) {
                btnText = "Retire User";
            } else if (usr.Status == false && usr.HasBeenActivated == false && usr.EmailConfirmed == true){
                btnText = "Activate User";
            } else if (usr.Status == false && usr.HasBeenActivated == true && usr.EmailConfirmed == true) {
                btnText = "Reactivate User";            
            } else if (usr.EmailConfirmed == false) {
                btnText = "Register";                
            }

            return btnText;
        }

        

        $scope.getButtonStatus = function getButtonStatus(usr) {
            var btnStatus = '';
            

            if (usr.Status == true) {
                btnStatus = "btn-warning";
            } else if (usr.Status == false && usr.HasBeenActivated == false && usr.EmailConfirmed == true) {
                btnStatus = "btn-success";
            } else if (usr.Status == false && usr.HasBeenActivated == true && usr.EmailConfirmed == true) {
                btnStatus = "btn-success";
            } else if (usr.EmailConfirmed == false) {
                btnStatus = "btn-bright";
            }

            return btnStatus;
        }

        $scope.edit = function (currentId) {
            $http
                .get('/UsersAdmin/Edit/', {
                    params: {
                        Id: currentId
                    }
                })
                .success(function (data, status) {
                    $('#Preview').html(data);
                    $('#myModal').modal('show');
                    $scope.initializeEditView();
                });

            
        }
        $scope.retire = function (user) {
            var currentId = user.Id;
            if (user.Status == false && user.HasBeenActivated == false && user.EmailConfirmed == false) {
                $http.get('/UsersAdmin/Register/', {
                    params: {
                        Id: currentId
                    }
                })
                    .success(function (data, status) {
                        $('#PreviewRegister').html(data);
                        $('#registerModal').modal('show');
                    });
            } else {
                $http.get('/UsersAdmin/Retire/', {
                        params: {
                            Id: currentId
                        }
                    })
                    .success(function (data, status) {
                        $('#PreviewRetire').html(data);
                        $('#retiredModal').modal('show');
                    });
            }
        }

       
           
        $scope.initializeEditView = function() {
            var dtInit = $('#GroupUpdatedDateTime').val();
            var groupInit = $('.selectpicker option:selected').val();
            $('.selectpicker').selectpicker('refresh');
            $('#chkUserStatus').change(function () {
                $log.log($('#sendEmail').val());
                if ($('#sendEmail').val() == false | $('#sendEmail').val() == 'False' | $('#sendEmail').val() == 'false') {
                    $('#sendEmail').val(true);
                } else {
                    $('#sendEmail').val(false); 
                    $('#sendEmail').attr('data-val');                    
                }
            });

            $('#groupSelect').on('change', function () {
                var dt = new Date();
                var datetime = dt.getMonth() + '/' + dt.getDay() + '/' + dt.getFullYear() + ' ' + dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds();
                if ($('.selectpicker option:selected').val() != groupInit) {
                    $('#GroupUpdatedDateTime').val(datetime);
                } else {
                    $('#GroupUpdatedDateTime').val(dtInit);
                }
            });
            $('.btnSubmit').click(function () {
                    toastr.clear();
                    toastr.success('Saving User', 'Saving User!', { timeOut: 0, extendedTimeOut: 0 });
                    

            });

            function onSubmitSuccess() {
                toastr.clear();
                toastr.success('User Saved', 'User Saved');
            }
            $scope.onSubmitSuccess = function (data) {
                toastr.clear();
                toastr.success('User Saved', 'User Saved');
            };
            var onSubmitFailure = function (data) {
                toastr.clear();
                toastr.success('Please check form. It appears ther was an error.', 'Something went wrong');
            };
        }

       
        $scope.sort = function (keyname) {
            $scope.sortKey = ['!!' + keyname, keyname]; //need to add the !! to move empty fields to start of sort  
            $scope.sortKeyName = keyname; //set the sortKey to the param passed
            $scope.reverse = !$scope.reverse; //if true make it false and vice versa
        }
        
    };
    indexController.$inject = ['$scope', '$log', '$http', 'userRole', 'userGroup', 'userName'];
    app.controller("indexController", indexController);
}(angular.module("cmcUsers")));