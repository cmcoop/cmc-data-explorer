(function (app) {
    var groupsController = function ($scope, $log, groupService, notificationFactory, parameterService,
                                        groupService,
                                        relatedParameterService, labService, userService,
                                        parameterGroupService, oData, userId, 
                                        userRole, userGroupId, userGroup) {

        //this function leverages angular.equals to do comparisons in array similar to jquery function $.inArray; however, it 
        //ignores some relics added by angular, such as $$hashtag - from use of ng-repeat in html. 
        function arrayObjectIndexOf(arr, obj) {
            for (var i = 0; i < arr.length; i++) {
                if (angular.equals(arr[i], obj)) {
                    return i;
                }
            };
            return -1;
        }

        $scope.initialize = function () {
            $scope.calParameters = [];
            $scope.groupsLoaded = false;
            $scope.nameExists = false;
            var activeElement = angular.element(document.querySelector('.active'));
            activeElement.removeClass('active');
            var menuManageElement = angular.element(document.querySelector('#menuManage'));
            $log.log(menuManageElement);
            menuManageElement.addClass('active');
            $scope.userGroupId = userGroupId;
            notificationFactory.success('Groups are loading...', 'Loading', { timeOut: 0, extendedTimeOut: 0 });
            $scope.getGroups();
            $scope.addGroupForm = {};
            $scope.currentGroup = {};
            $scope.newGroup = {};
            
            $scope.toggle = true;
            $scope.selectParameters = [];
            if (userRole == 'Monitor' | userRole == 'Coordinator') {
                $scope.isMonitorOrCoordinator = true;
            } else {
                $scope.isMonitorOrCoordinator = false;
            }
            
        }

        $scope.$watch("newGroup.Name", function (newValue, oldValue) {
            $scope.newGroup.Code = '';
            if (typeof newValue !== 'undefined') {
                (new groupService()).$getByName({ key: newValue })
                .then(function (data) {
                    if (data.value.length > 0) {
                    }else {
                        $scope.nameExists = false;
                        var strNewValue = newValue.replace('the', '');
                        strNewValue = strNewValue.replace('of', '');
                        var matches = strNewValue.match(/\b(\w)/g);
                        var groupCode = matches.join('').toUpperCase();
                        $scope.newGroup.Code = groupCode;
                        (new groupService()).$getByGroupCode({ key: groupCode })
                        .then(function (data) {
                            if (data.value.length > 0) {
                                (new groupService()).$getByGroupCodeStartsWith({ key: (groupCode + '.') })
                                .then(function (data) {
                                    if (data.value.length > 0) {
                                        var maxCode = data.value[0].Code;
                                        var newInt = parseInt(maxCode[maxCode.length - 1]) + 1;
                                        $scope.newGroup.Code = groupCode + '.' + newInt.toString();
                                    } else {
                                        $scope.newGroup.Code = groupCode + '.1';
                                    }
                                });
                            }
                        });
                    }
                });
                
            }
        });
        $scope.toggleGroupName = function () {
            if (typeof $scope.search == 'undefined' | $scope.search == '') {
                $scope.search = userGroup;
                $scope.showGroup = true;
            } else {
                $scope.search = '';
                $scope.showGroup = false;
            }
        }
       
        $scope.populateDropdowns = function () {
            $scope.search = [];

            $scope.labList = [
                {
                    "name": "",
                    "value": null
                }];
            return (new labService()).$getAll()
            .then(function (data) {
                angular.forEach(data.value, function (value, index) {
                    $scope.labList.push(
                        {
                            "name": value.Name,
                            "value": value.Id
                        }
                    )
                });


                $scope.binaryList = binaryNoNull;

                $scope.binaryListNoNull = binaryNoNull;
                $scope.newGroup.cmcQapp = $scope.binaryListNoNull[0].value;
                $scope.newGroup.coordinatorCanPublish = $scope.binaryListNoNull[0].value;

                $log.log($scope.labList);
                $scope.usStatesList = usStates;
                $scope.benthicMethodsList = benthicMethods;

                
                $scope.newGroup.State = $scope.usStatesList[0].value;
                $scope.newGroup.BenthicMethod = $scope.benthicMethodsList[0].value;
                $scope.cmcMemberList = [{
                    "name": "",
                    "value": null
                }];                
                $scope.newGroup.cmcMembers = [];

                

                return (new userService()).$getMembers()
                .then(function (data) {
                    $log.log('data');
                    $log.log(data);
                    angular.forEach(data.value, function (value, index) {
                        $scope.cmcMemberList.push(
                            {
                                "name": value.FirstName + ' ' + value.LastName,
                                "value": value.Id
                            }
                        )
                    });
                    $scope.tableCmcMemberList = [{
                        "name": "",
                        "value": ""                        

                    }];
                    angular.forEach(data.value, function (value, index) {
                        $scope.tableCmcMemberList.push(
                            {
                                "name": value.FirstName + ' ' + value.LastName,
                                "value": value.FirstName + ' ' + value.LastName
                            }
                        )
                    });

                    //$scope.watch
                    $scope.newGroup.cmcMembers = $scope.cmcMemberList[0].value;
                    //$scope.tableCmcMemberList = $scope.cmcMemberList;
                    $log.log('cmcMemberList');
                    $log.log($scope.tableCmcMemberList);
                    $log.log($scope.tableCmcMemberList[1].value);
                    $scope.search.cmcMembersConcat = $scope.tableCmcMemberList[0].value;
                });
            });

            

            
        };
        

       
        $scope.sort = function (keyname) {
            $scope.sortKey = ['!!' + keyname, keyname]; //need to add the !! to move empty fields to start of sort  
            $scope.sortKeyName = keyname; //set the sortKey to the param passed
            $scope.reverse = !$scope.reverse; //if true make it false and vice versa
        }

        $scope.sortParameter = function (keyname) {
            $scope.parameterSortKey = ['!!' + keyname, keyname]; //need to add the !! to move empty fields to start of sort  
            $scope.parameterSortKeyName = keyname; //set the sortKey to the param passed
            $scope.parameterReverse = !$scope.parameterReverse; //if true make it false and vice versa
        }

        
        $scope.getGroups = function () {
            $scope.selectedParameters = [];
            (new groupService()).$getAll()
                .then(function (data) {
                    $scope.groups = data.value;
                    $scope.reverse = true;
                    $scope.sort('Name');                    
                    $scope.headers = [];
                    
                   
                    angular.forEach(data.value[0], function (value, index) {
                        $log.log(index);
                        $scope.headers.push(index);
                    })

                    angular.forEach($scope.groups, function (v, k) {
                        var cmcMemberList = [];
                        if (v.CmcMemberUser !== null) {
                            cmcMemberList.push(v.CmcMemberUser.FirstName + ' ' + v.CmcMemberUser.LastName)
                        }
                        if (v.CmcMemberUser2 !== null) {
                            cmcMemberList.push(v.CmcMemberUser2.FirstName + ' ' + v.CmcMemberUser2.LastName)
                        }
                        if (v.CmcMemberUser3 !== null) {
                            cmcMemberList.push(v.CmcMemberUser3.FirstName + ' ' + v.CmcMemberUser3.LastName)
                        }
                        v.cmcMembersConcat = '';
                        
                        angular.forEach(cmcMemberList, function (value, key) {                            
                            if (key === 0) {
                                v.cmcMembersConcat = value;
                            } else {
                                v.cmcMembersConcat = v.cmcMembersConcat + '; ' + value;
                            }
                        });
                        
                    });
                    $scope.groupsLoaded = true;
                    notificationFactory.success('Groups Loaded.', 'Groups Loaded');

                    $scope.populateDropdowns();
                    $scope.toggleGroupName();
                   
                });
        };
        $scope.addGroupBtnClick = function () {
            //$scope.selectedParameters = [];
            
            $scope.getParameters();
            $scope.groupParameters = [];
            $scope.selectedParameters = [];
        };

        $scope.getParameters = function () {
            //$scope.selectedParameters = [];
            //$scope.groupParameters = [];
            //$scope.selectedParameters = [];
            (new parameterService()).$getAllWaterQuality()
                .then(function (data) {
                    //$log.log(data);
                    $scope.parameters = data.value;
                    //$log.log($scope.parameters[0]);
                    notificationFactory.success('Parameters Loaded.', 'Parameters Loaded');
                });
        };

        

        $scope.getCalParameters = function (shouldToggle, remove) {
            const shouldToggleParameter = shouldToggle;
            const removeParameter = remove;
            angular.forEach($scope.selectedParameters, function (value, index) {
                
                (new relatedParameterService()).$getByWqParameterIdExpandCalibrationParameter({ key: value.Id })
                .then(function (data) {
                    if (data.value.length > 0) {
                        angular.forEach(data.value, function (value, index) {
                            // check to see if the calibration parameter is already in the list
                            var result = $scope.calParameters.map(function (a) { return a.Code; });

                            var found = arrayObjectIndexOf(result, value.CalibrationParameter.Code);
                            if (found < 0) {
                                value.CalibrationParameter.WqParamId = value.WqParameter.Code;
                                $scope.calParameters.push(value.CalibrationParameter);
                            } else if (remove) {
                                $scope.calParameters.splice(found, 1);
                            }
                            //if (shouldToggle) {
                                //$scope.toggleParameter(value.CalibrationParameter);
                            //}
                        });
                    }                  
                    
                });
            });
            
        };

        $scope.setGroup = function (group) {
            $scope.currentGroup = group;
            $scope.sortParameter('Name');
            $log.log('current group');
            $log.log($scope.currentGroup);
            $scope.currentGroup.cmcMembers = [];
            if ($scope.currentGroup.CmcMember !== null) {
                $scope.currentGroup.cmcMembers.push($scope.currentGroup.CmcMember);
            }
            if ($scope.currentGroup.CmcMember2 !== null) {
                $scope.currentGroup.cmcMembers.push($scope.currentGroup.CmcMember2);
            }
            if ($scope.currentGroup.CmcMember3 !== null) {
                $scope.currentGroup.cmcMembers.push($scope.currentGroup.CmcMember3);
            }
            $log.log($scope.currentGroup.cmcMembers);
            
            $scope.setCurrentGroupParameters();
            $scope.getParameters();
            $scope.getCalParameters(true);
            $('.selectpicker').selectpicker({
                maxOptions: 3
            });
        };

        $scope.toggleParameter = function (parameter) {
            $scope.toggle = !$scope.toggle;
           
            var result = $scope.selectedParameters.map(function (a) { return a.Code; });            

            var found = arrayObjectIndexOf(result, parameter.Code);
            $log.log(found);
            var remove = false;
            if (found >= 0) {
                // remove calibration parameters
                $scope.getCalParameters(true);
                // Element was found, remove it.
                $scope.selectedParameters.splice(found, 1);
                remove = true
            } else {
                var newParam = parameter;
                newParam.LabId = null;
                newParam.DetectionLimit = null;
                // Element was not found, add it.
                $scope.selectedParameters.push(newParam);
            }
            if (parameter.isCalibrationParameter == false) {
                $scope.getCalParameters((found >= 0) ? false : true, remove);
            }
        };        

        $scope.parameterSelected = function (parameter) {
            var result = $scope.selectedParameters.map(function (a) { return a.Code; });            
            return arrayObjectIndexOf(result, parameter.Code) > -1;
        }

        $scope.setCurrentGroupParameters = function () {
            $scope.selectedParameters = [];
            $scope.groupParameters = [];
            angular.forEach($scope.currentGroup.ParameterGroups, function (value, index) {
                $log.log(value);
                value.Parameter.LabId = value.LabId;
                value.Parameter.DetectionLimit = value.DetectionLimit;
                $scope.selectedParameters.push(
                        value.Parameter                    
                    );
            });
        }



        $scope.updateGroup = function (form) {
            var currentGroup = $scope.currentGroup;
            var DateTimeNow = new Date().toJSON();
            if (form.$valid) {
                notificationFactory.success('Updating information for ' + currentGroup.Name + '.', 'Update', { timeOut: 0, extendedTimeOut: 0 });
                var updateGroup = {
                    "Name": currentGroup.Name,
                    "ContactName": currentGroup.ContactName,
                    "ContactEmail": currentGroup.ContactEmail,
                    "ContactCellPhone": currentGroup.ContactCellPhone,
                    "ContactOfficePhone": currentGroup.ContactOfficePhone,
                    "Description": currentGroup.Description,
                    "Url": currentGroup.Url,
                    "AddressFirst": currentGroup.AddressFirst,
                    "AddressSecond": currentGroup.AddressSecond,
                    "City": currentGroup.City,
                    "State": currentGroup.State,
                    "Zip": currentGroup.Zip,
                    "Code": currentGroup.Code,
                    "BenthicMethod": currentGroup.BenthicMethod,
                    "CmcMember": null,
                    "CmcMember2": null,
                    "CmcMember3": null,
                    "coordinatorCanPublish": currentGroup.coordinatorCanPublish,
                    "cmcQapp": currentGroup.cmcQapp,
                    "ModifiedBy": userId,
                    "ModifiedDate": DateTimeNow
                }

                if (typeof ($scope.currentGroup.cmcMembers[0]) !== 'undefined' & $scope.currentGroup.cmcMembers[0] !== null) {
                    updateGroup.CmcMember = $scope.currentGroup.cmcMembers[0];
                }
                if (typeof ($scope.currentGroup.cmcMembers[1]) !== 'undefined' & $scope.currentGroup.cmcMembers[1] !== null) {
                    updateGroup.CmcMember2 = $scope.currentGroup.cmcMembers[1];
                }
                if (typeof ($scope.currentGroup.cmcMembers[2]) !== 'undefined' & $scope.currentGroup.cmcMembers[2] !== null) {
                    updateGroup.CmcMember3 = $scope.currentGroup.cmcMembers[2];
                }

                var groupId = currentGroup.Id;
                $log.log(groupId);
                var batchRequest = [];
                batchRequest.push({ requestUri: "Groups(" + currentGroup.Id + ")", method: "PATCH", data: updateGroup });

                return (new parameterGroupService()).$getByGroupId({ key: currentGroup.Id })
                .then(function (data) {
                    $log.log(data);
                    var groupParameters = data.value;
                    $log.log(groupParameters);
                    angular.forEach(groupParameters, function (value, index) {
                        batchRequest.push({ requestUri: "ParameterGroups(" + value.Id + ")", method: "DELETE" });
                    });
                    angular.forEach($scope.selectedParameters, function (value, index) {
                        var parametersToAdd = {
                            GroupId: groupId,
                            ParameterId: value.Id,
                            LabId: value.LabId,
                            DetectionLimit: parseFloat(value.DetectionLimit)
                        }
                        batchRequest.push({ requestUri: "ParameterGroups", method: "POST", data: parametersToAdd });
                    });

                    if (currentGroup) {
                        oData.request({
                            requestUri: "/odata/$batch",
                            method: "POST",
                            data: {
                                __batchRequests: batchRequest

                            }
                        }, function (data, response) {
                            $scope.getGroups();
                        }, undefined, window.odatajs.oData.batch.batchHandler);
                    }

                    angular.element('#editGroupModal').modal('hide');
                });
            } else {
                notificationFactory.error('Please check form for errors', 'Something went wrong');                
                angular.forEach(form.$error, function (field) {
                    angular.forEach(field, function (errorField) {
                        errorField.$setTouched();
                    })
                });
            }
        }



        $scope.deleteGroup = function (group) {
            var currentGroup = group;
            notificationFactory.success(currentGroup.Name + ' is being deleted...', 'Deleting Group', { timeOut: 0, extendedTimeOut: 0 })
            return (new groupService()).$remove({ key: currentGroup.Id })
            .then(function (data) {
                notificationFactory.success(currentGroup.Name + ' is deleted.', 'Group Deleted');
                $scope.getGroups();
            });
        }

        $scope.addGroup = function (form) {
            var DateTimeNow = new Date().toJSON();
            var newGroup = $scope.newGroup;      
            if (form.$valid) {              

                var newGroupToAdd = {
                    "Name": newGroup.Name,
                    "Code": newGroup.Code,
                    "ContactName": newGroup.ContactName,
                    "ContactEmail": newGroup.ContactEmail,
                    "ContactCellPhone": newGroup.ContactCellPhone,
                    "ContactOfficePhone": newGroup.ContactOfficePhone,
                    "Description": newGroup.Description,
                    "Url": newGroup.Url,
                    "AddressFirst": newGroup.AddressFirst,
                    "AddressSecond": newGroup.AddressSecond,
                    "City": newGroup.City,
                    "State": newGroup.State,
                    "Zip": newGroup.Zip,
                    "BenthicMethod": newGroup.BenthicMethod,
                    "CmcMember": null,
                    "CmcMember2": null,
                    "CmcMember3": null,
                    "coordinatorCanPublish": newGroup.coordinatorCanPublish,
                    "cmcQapp": newGroup.cmcQapp,
                    "CreatedBy": userId,
                    "ModifiedBy": userId,
                    "ModifiedDate": DateTimeNow,
                    "CreatedDate": DateTimeNow
                }
                $log.log('cmcMembers');
                $log.log(newGroup);
                if (typeof newGroup.cmcMembers !== 'undefined' && newGroup.cmcMembers !== null && newGroup.cmcMembers.length > 0) {
                    if (typeof (newGroup.cmcMembers[0]) !== 'undefined') {
                        newGroupToAdd.CmcMember = newGroup.cmcMembers[0];
                    }
                    if (typeof (newGroup.cmcMembers[1]) !== 'undefined') {
                        newGroupToAdd.CmcMember2 = newGroup.cmcMembers[1];
                    }
                    if (typeof (newGroup.cmcMembers[2]) !== 'undefined') {
                        newGroupToAdd.CmcMember3 = newGroup.cmcMembers[2];
                    }
                }

                notificationFactory.success(newGroup.Name + ' is being added...', 'Adding Group', { timeOut: 0, extendedTimeOut: 0 })
                return (new groupService(newGroupToAdd)).$save()
                .then(function (data) {
                    $log.log(data.Id);
                    notificationFactory.success(newGroup.Name + ' added successfully', 'Group Added!');
                    //var parametersToAdd = [];

                    //notificationFactory.success(newGroup.Name + ' added successfully', 'Group Added!');
                    angular.forEach($scope.selectedParameters, function (value, index) {
                        var parametersToAdd = {
                            GroupId: data.Id,
                            ParameterId: value.Id,
                            //LabId: 8
                        };
                        $log.log(parametersToAdd);
                        return (new parameterGroupService(parametersToAdd)).$save()
                        //$log.log(value.Id);
                    });
                    $scope.newGroup = {};
                    $scope.getGroups();
                    
                    angular.element('#addGroupModal').modal('hide');
                    $scope.clearNewGroup(form);
                });
            }else{
                notificationFactory.error('Please check form for errors', 'Something went wrong');
                console.log(form);
                angular.forEach(form.$error, function (field) {
                    angular.forEach(field, function (errorField) {
                        errorField.$setTouched();
                    })
                });
            }
        }
        $scope.clearNewGroup = function (form) {
            $scope.newGroup = {};
            $scope.newGroup.State = $scope.usStatesList[0].value;
            $scope.clearFormValidation(form);
        }
        $scope.clearFormValidation = function (form) {
            form.$setUntouched();
        }

    };
    groupsController.$inject = ['$scope', '$log', 'groupService', 'notificationFactory', 'parameterService',
                                        'groupService',
                                        'relatedParameterService', 'labService', 'userService',
                                        'parameterGroupService', 'oData', 'userId', 
                                        'userRole', 'userGroupId', 'userGroup'];
    app.controller("groupsController", groupsController);
}(angular.module("cmcApp")));