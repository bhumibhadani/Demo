function getQueryStringValue(key) {
    return decodeURIComponent(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURIComponent(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
}
function toDataUrl(src, callback, outputFormat) {
    try {
        var img = new Image();
        img.crossOrigin = 'Anonymous';
        img.onload = function () {

            var canvas = document.createElement('CANVAS');
            var ctx = canvas.getContext('2d');
            var dataURL;
            canvas.height = this.height;
            canvas.width = this.width;
            ctx.drawImage(this, 0, 0);
            dataURL = canvas.toDataURL(outputFormat);
            callback(dataURL);
        };
        img.src = src;
        if (img.complete || img.complete === undefined) {
            img.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
            img.src = src;
        }
    } catch (e) {

    }

}

function ExecuteAjax(url, data, fnSuccess, fnError, isDisableLoading, CurrentUserID, RedirectToLoginURL) {
    /// <summary>To make ajax call to get/set data.</summary>
    /// <param name="url" type="String">Url to make ajax call.</param>
    /// <param name="data" type="Json">data to send with ajax call.</param>
    /// <param name="fnSuccess" type="Function">Success function of ajax call.</param>
    /// <param name="fnError" type="Function">Error function of ajax call.</param>
    try {
        if (CurrentSessionUserID != null && CurrentSessionUserID <= 0) {
            window.location.href = RedirectToLoginURL;
        }

        if (!isDisableLoading && isDisableLoading != true)
            $.loader();
        setTimeout(function () {
            $.ajax({
                type: 'POST',
                url: url,
                async: true,
                data: (data ? JSON.stringify(data) : "{}"),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: (typeof (fnSuccess) == "function" ?
                    function (response) {
                        if (!isDisableLoading && isDisableLoading != true)
                            $.loader('close');
                        fnSuccess(response);
                    }
                    :
                    function (response) {
                        if (!isDisableLoading && isDisableLoading != true)
                            $.loader('close');
                    }),
                error: (typeof (fnError) == "function" ?
                    function (xhr, ajaxOptions, thrownError) {
                        if (!isDisableLoading && isDisableLoading != true)
                            $.loader('close');
                        fnError(xhr, ajaxOptions, thrownError);
                    }
                    :
                    function (xhr, ajaxOptions, thrownError) {
                        if (!isDisableLoading && isDisableLoading != true)
                            $.loader('close');
                        alert(thrownError);
                    })
            });
        }, 300);
    } catch (e) {
        throw e;
    }

}

//var $toastlast;

function ShowMessage(MsgType, Msg) {
    /// <summary>Show Notification Message.</summary>
    /// <param name="MsgType" type="String">Type of Message(success/info/warning/error).</param>
    /// <param name="Msg" type="String">Message to Display.</param>

    //if ($toastlast)
    //    toastr.clear($toastlast);
    //    toastr.clear();
    toastr.options = {
        "closeButton": true,
        "debug": false,
        "newestOnTop": false,
        "progressBar": false,
        //"positionClass": "toast-top-center",
        //"positionClass": "toast-top-full-width",
        "positionClass": "toast-top-right",
        "preventDuplicates": true,
        "onclick": null,
        "showDuration": "300",
        "hideDuration": "1000",
        "timeOut": "10000",
        "extendedTimeOut": "10000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut",
        "tapToDismiss": true
    }

    if (MsgType.trim().length > 0) {
        switch (MsgType.toLowerCase()) {
            case "success":
                toastr.success(Msg);
                break;
            case "info":
                toastr.info(Msg);
                break;
            case "warning":
                toastr.warning(Msg);
                break;
            case "error":
                toastr.error(Msg);
                break;
            default:
                toastr.info(Msg);
                break;
        }
    }
    else {
        Msg = Msg.trim() == "" ? "No Message" : Msg;
        toastr.info(Msg);
    }
    $toastlast = toastr;
}


$.date = function (dateObject) {
    var d = new Date(dateObject);
    var day = d.getDate();
    var month = d.getMonth() + 1;
    var year = d.getFullYear();
    if (day < 10) {
        day = "0" + day;
    }
    if (month < 10) {
        month = "0" + month;
    }
    var date = day + "/" + month + "/" + year;

    return date;
};

function AlertMessage(message, titleVal) {
    $.alert({
        title: titleVal,
        content: message,
        autoClose: 'cancel|3',
        closeIcon: true,
        closeIconClass: 'fa fa-close',
        backgroundDismiss: true,
        minHeight: '50',
        maxHeight: '100',
        confirm: function () {
        }
    });
}
function UploadImage(ContolID, AdditionalData, fnSuccess, fnError) {
    /// <summary>To Upload Image.</summary>
    /// <param name="ContolID" type="String">It is the id of file upload control.</param>
    /// <param name="AdditionalData" type="Array">It is the array of JSON having "<name>:<value>" in array({'name':'somename','value':'somevalue'}, ...)</param>
    /// <param name="fnSuccess" type="Function">It is the call back function for success.</param>
    /// <param name="fnError" type="Function">It is the call back function for error.</param>


    if (window.FormData !== undefined) {// Checking whether FormData is available in browser
        var fileUpload = $("#" + ContolID).get(0);
        var files = fileUpload.files;
        if (files.length > 0) {
            var fileData = new FormData();  // Create FormData object

            for (var i = 0; i < files.length; i++)// Looping over all files and add it to FormData object
                fileData.append(files[i].name, files[i]);

            if (AdditionalData && AdditionalData.length > 0) {//Checking for Additional Form Data
                for (var i = 0; i < AdditionalData.length; i++)
                    fileData.append(AdditionalData[i].name, AdditionalData[i].value);
            }

            $.ajax({
                url: '/Image/Upload',
                type: "POST",
                contentType: false, // Not to set any content header
                processData: false, // Not to process data
                async:false,
                data: fileData,
                success: function (result) {

                    if (typeof (fnSuccess) == "function")
                        fnSuccess(result);
                },
                error: function (err) {

                    if (typeof (fnError) == "function")
                        fnError(err);
                }
            });
        }
        else {
            alertWarning("Please select image.");
            return false;
        }
    } else {
        alertWarning("FormData is not supported.");
    }
}

function BindNestedLocationCombo(customerId, locationCode, controlId) {
    var data1 = { "customerId": customerId, "locationCode": locationCode };
    $.ajax({
        url: '/Location/GetNestedLocations',
        type: 'POST',
        datatype: "json",
        data: JSON.stringify(data1),
        async: false,
        contentType: 'application/json; charset=utf-8',
        error: function (json, textStatus, errorThrown) {
        },
        success: function (data) {
            var arr = JSON.parse(data);
            if (arr == null || arr == undefined) {
                arr = [];
            }
           // arr.unshift({
           //     LocationCode: "",
           //     LocationName: "ALL"
           // });
           // var source = {
           //     datatype: "json",
           //     localdata: arr,
           //     datafields: [
           //         { name: 'LocationCode', type: 'string' },
           //         { name: 'LocationName', type: 'string' }
           //     ]
           // };
            for (var i = 0; i < arr.length; i++) {
                var strHtml = '<option value="' + arr[i].LocationCode + '">' + arr[i].LocationName + '</option>';
                $(controlId).append(strHtml);
            }
            $(controlId).select2({
                placeholder: "Select Location"
            });
            //var dataAdapterCustomer = new $.jqx.dataAdapter(source);
            ////$(controlId).jqxDropDownList({ filterable: true, checkboxes: true, dropDownVerticalAlignment: "bottom", source: dataAdapterCustomer, displayMember: "LocationName", valueMember: "LocationCode", width: '100%', height: 40, placeHolder: "Select Location", theme: 'energyblue' });
            //$(controlId).jqxComboBox({ checkboxes: true, source: dataAdapterCustomer, displayMember: "LocationName", valueMember: "LocationCode", width: '100%', height: 40, placeHolder: "Select Location", theme: 'energyblue' });
        }
    });
}
function split(val) {
    return val.split(/,\s*/);
}
function extractLast(term) {
    return split(term).pop();
}
function BindCustomerCodeAutoComplete(customerId, controlId) {
    //debugger;
    var container = $(controlId).parent().find("#txtCustomerCodeContainer")[0].id;    
    $(controlId).autocomplete({
            minLength: 2,
            source: function (request, response) {
                $.ajax({
                    url: "/CompanyCustomer/BindAutotCompleteCompanyCustomerList?customerCode=" + extractLast(request.term) + "&customerId=" + customerId,
                    dataType: 'json',
                    type: 'GET',
                    processdata: true,
                    contentType: 'application/json; charset=utf-8',
                    async: false,
                    success: function (result) {
                        var data = JSON.parse(result);
                        response(
                            $.map(data, function (item) {
                                return {
                                    label: item.CustomerCode,
                                    val: item.CustomerCode,
                                    value: item.CustomerCode
                                };
                            }));
                    },
                    error: function (response) {

                    },
                    failure: function (response) {

                    }
                });
            },
            focus: function () {
                // prevent value inserted on focus
                return false;
            },
            select: function (event, ui) {
                var terms = split(this.value);
                // remove the current input
                terms.pop();
                // add the selected item
                terms.push(ui.item.value);
                // add placeholder to get the comma-and-space at the end
                terms.push("");
                this.value = terms.join(",");
                return false;
            }
            , position: { my: "left top", at: "left bottom", collision: "fit flip" }
            , appendTo: "#" + container
        });
}
// Added Functions for Track Vehicle Map Utility
//*********************************************************************//
//*********************************************************************//
function BindBikerAutoComplete(controlId) {
    //debugger;
    var container = $(controlId).parent().find("#txtDriverContainer")[0].id;
    $(controlId).autocomplete({
        minLength: 2,
        source: function (request, response) {
            $.ajax({
                url: "/Track/GetBikersforCustomers?Query=" + extractLast(request.term),
                dataType: 'json',
                type: 'GET',
                processdata: true,
                contentType: 'application/json; charset=utf-8',
                async: false,
                success: function (result) {
                    var data = JSON.parse(result);
                    response(
                        $.map(data, function (item) {
                            return {
                                label: item,
                                val: item,
                                value: item
                            };
                        }));
                },
                error: function (response) {

                },
                failure: function (response) {

                }
            });
        },
        focus: function () {
            // prevent value inserted on focus
            return false;
        },
        select: function (event, ui) {
            var terms = split(this.value);
            // remove the current input
            terms.pop();
            // add the selected item
            terms.push(ui.item.value);
            // add placeholder to get the comma-and-space at the end
            terms.push("");
            this.value = terms.join(",");
            return false;
        }
        , position: { my: "left top", at: "left bottom", collision: "fit flip" }
        , appendTo: "#" + container
    });
}
function BindVehicleAutoComplete(controlId) {
    //debugger;
    var container = $(controlId).parent().find("#txtVehicleContainer")[0].id;
    $(controlId).autocomplete({
        minLength: 2,
        source: function (request, response) {
            $.ajax({
                url: "/Track/GetVehiclesforCustomers?query=" + extractLast(request.term),
                dataType: 'json',
                type: 'GET',
                processdata: true,
                contentType: 'application/json; charset=utf-8',
                async: false,
                success: function (result) {
                    var data = JSON.parse(result);
                    response(
                        $.map(data, function (item) {
                            return {
                                label: item,
                                val: item,
                                value: item
                            };
                        }));
                },
                error: function (response) {

                },
                failure: function (response) {

                }
            });
        },
        focus: function () {
            // prevent value inserted on focus
            return false;
        },
        select: function (event, ui) {
            var terms = split(this.value);
            // remove the current input
            terms.pop();
            // add the selected item
            terms.push(ui.item.value);
            // add placeholder to get the comma-and-space at the end
            terms.push("");
            this.value = terms.join(",");
            return false;
        }
        , position: { my: "left top", at: "left bottom", collision: "fit flip" }
        , appendTo: "#" + container
    });
}
//*********************************************************************//
//*********************************************************************//

function BindOriginCityAutoComplete(controlId) {
    //debugger;
    var container = $(controlId).parent().find("#txtOriginCityContainer")[0].id;
    $(controlId).autocomplete({
        minLength: 2,
        source: function (request, response) {
            $.ajax({
                url: "/BookingOrderUpload/GetDestinationCityList?prefix=" + extractLast(request.term),
                dataType: 'json',
                type: 'GET',
                processdata: true,
                contentType: 'application/json; charset=utf-8',
                async: false,
                success: function (result) {
                    var data = JSON.parse(result);
                    response(
                        $.map(data, function (item) {
                            return {
                                label: item.Name,
                                val: item.Code,
                                value: item.Value,
                                codeid: item.Code
                            };
                        }));
                },
                error: function (response) {

                },
                failure: function (response) {

                }
            });
        },
        focus: function () {
            // prevent value inserted on focus
            return false;
        },
        select: function (event, ui) {
            var terms = split(this.value);
            // remove the current input
            terms.pop();
            // add the selected item
            terms.push(ui.item.value);
            // add placeholder to get the comma-and-space at the end
            terms.push("");
            this.value = terms.join(",");
            return false;
        }
        , position: { my: "left top", at: "left bottom", collision: "fit flip" }
        , appendTo: "#" + container
    });
}
function BindStateAutoComplete(controlId) {
    //debugger;
    var container = $(controlId).parent().find("#txtStateContainer")[0].id;
    $(controlId).autocomplete({
        minLength: 2,
        source: function (request, response) {
            $.ajax({
                url: "/OrderUpload/GetDestinationStateList?prefix=" + extractLast(request.term),
                dataType: 'json',
                type: 'GET',
                processdata: true,
                contentType: 'application/json; charset=utf-8',
                async: false,
                success: function (result) {
                    var data = JSON.parse(result);
                    response(
                        $.map(data, function (item) {
                            return {
                                label: item.Name,
                                val: item.Code,
                                value: item.Value,
                                codeid: item.Code
                            };
                        }));
                },
                error: function (response) {

                },
                failure: function (response) {

                }
            });
        },
        focus: function () {
            // prevent value inserted on focus
            return false;
        },
        select: function (event, ui) {
            var terms = split(this.value);
            // remove the current input
            terms.pop();
            // add the selected item
            terms.push(ui.item.value);
            // add placeholder to get the comma-and-space at the end
            terms.push("");
            this.value = terms.join(",");
            return false;
        }
        , position: { my: "left top", at: "left bottom", collision: "fit flip" }
        , appendTo: "#" + container
    });
}
function BindDestinationCityAutoComplete(controlId) {
    //debugger;
    var container = $(controlId).parent().find("#txtDestinationCityContainer")[0].id;
    $(controlId).autocomplete({
        minLength: 2,
        source: function (request, response) {
            $.ajax({
                url: "/BookingOrderUpload/GetDestinationCityList?prefix=" + extractLast(request.term),
                dataType: 'json',
                type: 'GET',
                processdata: true,
                contentType: 'application/json; charset=utf-8',
                async: false,
                success: function (result) {
                    var data = JSON.parse(result);
                    response(
                        $.map(data, function (item) {
                            return {
                                label: item.Name,
                                val: item.Code,
                                value: item.Value,
                                codeid: item.Code
                            };
                        }));
                },
                error: function (response) {

                },
                failure: function (response) {

                }
            });
        },
        focus: function () {
            // prevent value inserted on focus
            return false;
        },
        select: function (event, ui) {
            var terms = split(this.value);
            // remove the current input
            terms.pop();
            // add the selected item
            terms.push(ui.item.value);
            // add placeholder to get the comma-and-space at the end
            terms.push("");
            this.value = terms.join(",");
            return false;
        }
        , position: { my: "left top", at: "left bottom", collision: "fit flip" }
        , appendTo: "#" + container
    });
}

function BindCustomerCodeListAutoComplete(CompanyId,controlId) {
    //debugger;
    var container = $(controlId).parent().find("#txtCustomerCodeContainer")[0].id;
    $(controlId).autocomplete({
        minLength: 2,
        source: function (request, response) {
            $.ajax({
                url: "/api/WebAPI/GetCustomerListByPrefix?CompanyId=" + CompanyId + "&Prefix=" + request.term,
                dataType: 'json',
                type: 'GET',
                processdata: true,
                contentType: 'application/json; charset=utf-8',
                async: false,
                success: function (result) {
                    var data = JSON.parse(result);
                    response(
                        $.map(data, function (item) {
                            return {
                                label: item.CustomerName,
                                val: item.CustomerCode,
                                value: item.CustomerName,
                                codeid: item.CompanyId
                            };
                        }));
                },
                error: function (response) {

                },
                failure: function (response) {

                }
            });
        },
        focus: function () {
            // prevent value inserted on focus
            return false;
        },
        select: function (event, ui) {
            var terms = split(this.value);
            // remove the current input
            terms.pop();
            // add the selected item
            terms.push(ui.item.value);
            // add placeholder to get the comma-and-space at the end
            terms.push("");
            //this.value = terms.join(",");
            this.value = ui.item.value;
            $("#hdnCustomerCode").val(ui.item.val);
            return false;
        }
        , position: { my: "left top", at: "left bottom", collision: "fit flip" }
        , appendTo: "#" + container
    });
}

// Order List Auto Suggest 
function BindOrderNoAutoComplete(controlId) {
    //debugger;
    var container = $(controlId).parent().find("#txtOrderNoContainer")[0].id;
    $(controlId).autocomplete({
        minLength: 2,
        source: function (request, response) {
            $.ajax({
                url: "/Track/GetOrdersforCustomers?Query=" + extractLast(request.term),
                dataType: 'json',
                type: 'GET',
                processdata: true,
                contentType: 'application/json; charset=utf-8',
                async: false,
                success: function (result) {
                    var data = JSON.parse(result);
                    response(
                        $.map(data, function (item) {
                            return {
                                label: item,
                                val: item,
                                value: item,
                                codeid: item
                            };
                        }));
                },
                error: function (response) {

                },
                failure: function (response) {

                }
            });
        },
        focus: function () {
            // prevent value inserted on focus
            return false;
        },
        select: function (event, ui) {
            var terms = split(this.value);
            // remove the current input
            terms.pop();
            // add the selected item
            terms.push(ui.item.value);
            // add placeholder to get the comma-and-space at the end
            terms.push("");
            //this.value = terms.join(",");
            this.value = ui.item.value;
            $("#hdnCustomerCode").val(ui.item);
            return false;
        }
        , position: { my: "left top", at: "left bottom", collision: "fit flip" }
        , appendTo: "#" + container
    });
}

function BindCityAutoComplete(controlId) {
    //debugger;
    var container = $(controlId).parent().find("#txtCityContainer")[0].id;
    $(controlId).autocomplete({
        minLength: 2,
        source: function (request, response) {
            $.ajax({
                url: "/Reports/GetKarttrackCity?prefix=" + extractLast(request.term),
                dataType: 'json',
                type: 'GET',
                processdata: true,
                contentType: 'application/json; charset=utf-8',
                async: false,
                success: function (result) {
                    var data = JSON.parse(result);
                    response(
                        $.map(data, function (item) {
                            return {
                                label: item.Name,
                                val: item.Code,
                                value: item.Code
                            };
                        }));
                },
                error: function (response) {

                },
                failure: function (response) {

                }
            });
        },
        focus: function () {
            // prevent value inserted on focus
            return false;
        },
        select: function (event, ui) {
            var terms = split(this.value);
            // remove the current input
            terms.pop();
            // add the selected item
            terms.push(ui.item.value);
            // add placeholder to get the comma-and-space at the end
            terms.push("");
            this.value = terms.join(",");
            return false;
        }
        , position: { my: "left top", at: "left bottom", collision: "fit flip" }
        , appendTo: "#" + container
    });
}

//Added By Aishwarya
function BindBrandNameAutoComplete(controlId) {
    //debugger;
    var container = $(controlId).parent().find("#txtBrandContainer")[0].id;
    $(controlId).autocomplete({
        minLength: 2,
        source: function (request, response) {
            $.ajax({
                url: "/OrderUpload/GetBrandNameListForAutocomplete?prefix=" + extractLast(request.term),
                dataType: 'json',
                type: 'GET',
                processdata: true,
                contentType: 'application/json; charset=utf-8',
                async: false,
                success: function (result) {
                    var data = JSON.parse(result);
                    response(
                        $.map(data, function (item) {
                            return {
                                label: item.Name,
                                val: item.Code,
                                value: item.Code,
                                codeid: item.Code
                            };
                        }));
                },
                error: function (response) {

                },
                failure: function (response) {

                }
            });
        },
        focus: function () {
            // prevent value inserted on focus
            return false;
        },
        select: function (event, ui) {
            var terms = split(this.value);
            // remove the current input
            terms.pop();
            // add the selected item
            terms.push(ui.item.value);
            // add placeholder to get the comma-and-space at the end
            terms.push("");
            this.value = terms.join(",");
            return false;
        }
        , position: { my: "left top", at: "left bottom", collision: "fit flip" }
        , appendTo: "#" + container
    });
}


function BindPlantCodeAutoComplete(controlId) {
    //debugger;
    var container = $(controlId).parent().find("#ToPlantCodeContainer")[0].id;
    $(controlId).autocomplete({
        minLength: 2,
        source: function (request, response) {
            $.ajax({
                url: "/OrderUpload/GetPlantCodeListForAutocomplete?prefix=" + extractLast(request.term),
                dataType: 'json',
                type: 'GET',
                processdata: true,
                contentType: 'application/json; charset=utf-8',
                async: false,
                success: function (result) {
                    var data = JSON.parse(result);
                    response(
                        $.map(data, function (item) {
                            return {
                                label: item.Name,
                                val: item.Code,
                                value: item.Code,
                                codeid: item.Code
                            };
                        }));
                },
                error: function (response) {

                },
                failure: function (response) {

                }
            });
        },
        focus: function () {
            // prevent value inserted on focus
            return false;
        },
        select: function (event, ui) {
            var terms = split(this.value);
            // remove the current input
            terms.pop();
            // add the selected item
            terms.push(ui.item.value);
            // add placeholder to get the comma-and-space at the end
            terms.push("");
            this.value = terms.join(",");
            return false;
        }
        , position: { my: "left top", at: "left bottom", collision: "fit flip" }
        , appendTo: "#" + container
    });
}


function BindDestinationCityAutoComplete1(controlId) {
    //debugger;
    var container = $(controlId).parent().find("#txtCityContainer")[0].id;
    $(controlId).autocomplete({
        minLength: 2,
        source: function (request, response) {
            $.ajax({
                url: "/OrderUpload/GetDestinationCityList?prefix=" + extractLast(request.term),
                dataType: 'json',
                type: 'GET',
                processdata: true,
                contentType: 'application/json; charset=utf-8',
                async: false,
                success: function (result) {
                    var data = JSON.parse(result);
                    response(
                        $.map(data, function (item) {
                            return {
                                label: item.Name,
                                val: item.Code,
                                value: item.Code,
                                codeid: item.Code
                            };
                        }));
                },
                error: function (response) {

                },
                failure: function (response) {

                }
            });
        },
        focus: function () {
            // prevent value inserted on focus
            return false;
        },
        select: function (event, ui) {
            var terms = split(this.value);
            // remove the current input
            terms.pop();
            // add the selected item
            terms.push(ui.item.value);
            // add placeholder to get the comma-and-space at the end
            terms.push("");
            this.value = terms.join(",");
            return false;
        }
        , position: { my: "left top", at: "left bottom", collision: "fit flip" }
        , appendTo: "#" + container
    });
}
//Added By Aishwarya
function BindDestinationStateAutoComplete(controlId) {
    //debugger;
    var container = $(controlId).parent().find("#txtStateContainer")[0].id;
    $(controlId).autocomplete({
        minLength: 2,
        source: function (request, response) {
            $.ajax({
                url: "/OrderUpload/GetDestinationStateList?prefix=" + extractLast(request.term),
                dataType: 'json',
                type: 'GET',
                processdata: true,
                contentType: 'application/json; charset=utf-8',
                async: false,
                success: function (result) {
                    var data = JSON.parse(result);
                    response(
                        $.map(data, function (item) {
                            return {
                                label: item.Name,
                                val: item.Code,
                                value: item.Code,
                                codeid: item.Code
                            };
                        }));
                },
                error: function (response) {

                },
                failure: function (response) {

                }
            });
        },
        focus: function () {
            // prevent value inserted on focus
            return false;
        },
        select: function (event, ui) {
            var terms = split(this.value);
            // remove the current input
            terms.pop();
            // add the selected item
            terms.push(ui.item.value);
            // add placeholder to get the comma-and-space at the end
            terms.push("");
            this.value = terms.join(",");
            return false;
        }
        , position: { my: "left top", at: "left bottom", collision: "fit flip" }
        , appendTo: "#" + container
    });
}

    //Added By Aishwarya
    function BindLSPAutoComplete(controlId) {
        //debugger;
        var container = $(controlId).parent().find("#txtLSPContainer")[0].id;
        $(controlId).autocomplete({
            minLength: 2,
            source: function (request, response) {
                $.ajax({
                    url: "/OrderUpload/GetLSPList?prefix=" + extractLast(request.term),
                    dataType: 'json',
                    type: 'GET',
                    processdata: true,
                    contentType: 'application/json; charset=utf-8',
                    async: false,
                    success: function (result) {
                        var data = JSON.parse(result);
                        response(
                            $.map(data, function (item) {
                                return {
                                    label: item.Name,
                                    val: item.Code,
                                    value: item.Code,
                                    codeid: item.Code
                                };
                            }));
                    },
                    error: function (response) {

                    },
                    failure: function (response) {

                    }
                });
            },
            focus: function () {
                // prevent value inserted on focus
                return false;
            },
            select: function (event, ui) {
                var terms = split(this.value);
                // remove the current input
                terms.pop();
                // add the selected item
                terms.push(ui.item.value);
                // add placeholder to get the comma-and-space at the end
                terms.push("");
                this.value = terms.join(",");
                return false;
            }
            , position: { my: "left top", at: "left bottom", collision: "fit flip" }
            , appendTo: "#" + container
        });
    
}




function CreateDatatable(tableId, columns, data, showExcelExport, aryExportColumnIndex, fileName, columnDefs, select, order, buttons, scrollX, scrollY, paging, emptyTableMessage, search, scrollCollapse) {
    try {
        var ID = $(tableId);
        var options = {};

        options["scrollX"] = true;
        options["scrollY"] = true;

        if (ID.find('tbody tr').length > 0)
            ID.dataTable().fnDestroy();

        if (columns && columns.length > 0)
            options["columns"] = columns;

        if (columnDefs && columnDefs.length > 0)
            options["columnDefs"] = columnDefs;

        if (select != undefined)
            options["select"] = select;

        if (order != undefined)
            options["order"] = order;

        if (buttons && buttons.length > 0)
            options["buttons"] = buttons;

        if (scrollX != undefined)
            options["scrollX"] = scrollX;

        if (scrollY != undefined)
            options["scrollY"] = scrollY;

        if (paging != undefined)
            options["paging"] = paging;

        if (data && data.length > 0)
            options["data"] = data;

        //if (search != true)
        options["searching"] = search;

        if (scrollCollapse != undefined)
            options["scrollCollapse"] = scrollCollapse;

        if (emptyTableMessage && emptyTableMessage != undefined) {
            $.extend(options, {
                language: {
                    'emptyTable': emptyTableMessage
                }
            });
        }

        if (showExcelExport != undefined && showExcelExport != null && showExcelExport == true) {
            options["dom"] = "lfBrtip";
            options["buttons"] = [
                {
                    extend: 'excel',
                    title: fileName,
                    extension: '.xlsx',
                    text: '<span data-toggle="tooltip" title="Export to Excel"><i class="la la-download" aria-hidden="true"></i></span>',
                    exportOptions: {
                        columns: aryExportColumnIndex,
                        format: {
                            body: function (data, column, row, cell) {
                                if (row == 0) {//returning SrNo in 1st column
                                    return (column + 1);
                                }
                                else {
                                    return data;
                                }
                            }
                        }
                    }
                }
            ];
        }

        options["columnDefs"] = [{
            "targets": 'no-sort',
            "orderable": false,
        }];


        ID.DataTable(options);

        var dtWrapper = ID.closest("div.dataTables_wrapper");
        if (showExcelExport != undefined && showExcelExport != null && showExcelExport == true) {
            dtWrapper.find("div.dataTables_length").addClass("col-lg-5 col-md-5 col-sm-5 col-xs-12");
            dtWrapper.find("div.dataTables_filter").addClass("col-lg-6 col-md-6 col-sm-5 col-xs-12");
            dtWrapper.find("div.dt-buttons").addClass("col-lg-1 col-md-1 col-sm-2 col-xs-12 text-right");
            dtWrapper.find("div.dt-buttons a").prop("class", "btn btn-primary btn-xs");
            dtWrapper.find("div.dataTables_info").addClass("col-lg-6 col-md-6 col-sm-6 col-xs-12");
            dtWrapper.find("div.dataTables_paginate").addClass("col-lg-6 col-md-6 col-sm-6 col-xs-12");
        }
        if (search == true)
            dtWrapper.find("div.dataTables_info").removeClass("col-lg-6 col-md-6 col-sm-6 col-xs-12");
        //dtWrapper.find("div.dataTables_length select").select2();
    } catch (e) {
        alert(e.message);
    }
}

// Added Common Functions for Controls used in Reports
//*********************************************************************//
//*********************************************************************//

function InitializeDateRangePicker() {
    /*************************************** DATE RANGE PICKER CODE START ******************************************/
    /* Set From-To Date */
    var _fromDate = moment().format(defaultDateFormat);
    var _toDate = moment().format(defaultDateFormat);
    //var _fromDate = '23/02/2019';
    //var _toDate = '02/24/2019';
    $('#txtFromDate').val(_fromDate);
    $('#txtToDate').val(_toDate);

    var _paramsDateRange = {
        ControlId: "DateRangeFromTo",
        startDate: _fromDate,
        endDate: _toDate,
        AllowPastDate: true,
        AllowFutureDate: false,
        singleDatePicker: false
    };

    DefaultDatePickers.InitDatePicker(_paramsDateRange);
    $('#DateRangeFromTo').on('apply.daterangepicker', function (ev, picker) {
        $('#txtFromDate').val(moment(picker.startDate).format(defaultDateFormat));
        $('#txtToDate').val(moment(picker.endDate).format(defaultDateFormat));
    });

    // Do not remove this code - this code is to open daterangepicker left side
    $('body').find('.opensright').removeClass('opensright').addClass('opensleft');
    /*************************************** DATE RANGE PICKER CODE END ******************************************/
}
function InitializeDateRangePicker2() {
    /*************************************** DATE RANGE PICKER CODE START ******************************************/
    /* Set From-To Date */
    var _fromDate = moment().format(defaultDateFormat);
    var _toDate = moment().format(defaultDateFormat);
    //var _fromDate = '23/02/2019';
    //var _toDate = '02/24/2019';
    $('#txtFromDate').val(_fromDate);
    $('#txtToDate').val(_toDate);

    var _paramsDateRange = {
        ControlId: "DateRangeFromTo",
        startDate: _fromDate,
        endDate: _toDate,
        AllowPastDate: true,
        AllowFutureDate: true,
        singleDatePicker: false
    };

    DefaultDatePickers.InitDatePicker(_paramsDateRange);
    $('#DateRangeFromTo').on('apply.daterangepicker', function (ev, picker) {
        $('#txtFromDate').val(moment(picker.startDate).format(defaultDateFormat));
        $('#txtToDate').val(moment(picker.endDate).format(defaultDateFormat));
    });

    // Do not remove this code - this code is to open daterangepicker left side
    $('body').find('.opensright').removeClass('opensright').addClass('opensleft');
    /*************************************** DATE RANGE PICKER CODE END ******************************************/
}

//function InitializeDateRangePicker(_fromDate,_toDate) {
//    /*************************************** DATE RANGE PICKER CODE START ******************************************/
//    /* Set From-To Date */
//    //var _fromDate = moment().format(defaultDateFormat);
//    //var _toDate = moment().format(defaultDateFormat);
//    //var _fromDate = '23/02/2019';
//    //var _toDate = '02/24/2019';
//    $('#txtFromDate').val(_fromDate);
//    $('#txtToDate').val(_toDate);

//    var _paramsDateRange = {
//        ControlId: "DateRangeFromTo",
//        startDate: _fromDate,
//        endDate: _toDate,
//        AllowPastDate: true,
//        AllowFutureDate: false,
//        singleDatePicker: false
//    };

//    DefaultDatePickers.InitDatePicker(_paramsDateRange);
//    $('#DateRangeFromTo').on('apply.daterangepicker', function (ev, picker) {
//        $('#txtFromDate').val(moment(picker.startDate).format(defaultDateFormat));
//        $('#txtToDate').val(moment(picker.endDate).format(defaultDateFormat));
//    });

//    // Do not remove this code - this code is to open daterangepicker left side
//    $('body').find('.opensright').removeClass('opensright').addClass('opensleft');
//    /*************************************** DATE RANGE PICKER CODE END ******************************************/
//}


function onDownloadOptionClick(obj) {

    $("#hdnShareMethod").val($(obj).attr("data-val"));
    var selectedShareMethod = $(obj).attr("data-val");
    if (selectedShareMethod == "download") {
        $("#dvEmail").hide();
        $("#dvDownload").show();
        $("#lnkDone").html("GET FILE");
        $("#btnDownloadReport").removeClass("btn-default");
        $("#btnDownloadReport").addClass("btn-primary");
        $("#btnEmailReport").addClass("btn-default");
        $("#btnEmailReport").removeClass("btn-primary");
    }
    else if (selectedShareMethod == "email") {
        $("#txtShareEmailIds").val("");
        $("#txtShareMessage").val("");
        $("#lnkDone").html("SEND");
        $("#dvDownload").hide();
        $("#dvEmail").show();
        $("#btnDownloadReport").addClass("btn-default");
        $("#btnDownloadReport").removeClass("btn-primary");
        $("#btnEmailReport").removeClass("btn-default");
        $("#btnEmailReport").addClass("btn-primary");
    }
    else if (selectedShareMethod == "socialmedia") {
        $("#lnkDone").html("PUBLISH");
        $("#dvDownload").hide();
        $("#dvEmail").hide();
    }
    else {
        $("#lnkDone").html("Upload");
        $("#dvDownload").hide();
        $("#dvEmail").hide();
        $(obj).toggleClass("btn-default");
        $(obj).toggleClass("btn-primary");
    }
}

var handleDropDownListVariable = true;
function ManageMultiSelectionDropdownList(controlId, event) {
    if (!handleDropDownListVariable)
        return;
    var item = event.args.item;
    if (item) {
        if (item.label == "ALL") {
            handleDropDownListVariable = false;
            if (event.args.checked) {
                $('#' + controlId).jqxDropDownList('checkAll');

            }
            else {
                $('#' + controlId).jqxDropDownList('uncheckAll');
            }
            handleDropDownListVariable = true;
        }
        else {
            handleDropDownListVariable = false;
            $('#' + controlId).jqxDropDownList('checkIndex', 0);
            var checkedItems = $('#' + controlId).jqxDropDownList('getCheckedItems');
            var items = $('#' + controlId).jqxDropDownList('getItems');

            if (checkedItems.length == 1)
                $('#' + controlId).jqxDropDownList('uncheckIndex', 0);
            else if (items.length != checkedItems.length)
                $('#' + controlId).jqxDropDownList('indeterminateIndex', 0);
            handleDropDownListVariable = true;
        }
    }
    return true;
}

var handleVariable = true;
function ManageMultiSelectionComboBox(controlId, event) {
    if (!handleVariable)
        return;
    var item = event.args.item;
    if (item) {
        if (item.label == "ALL") {
            handleVariable = false;
            if (event.args.checked) {
                $('#' + controlId).jqxComboBox('checkAll');

            }
            else {
                $('#' + controlId).jqxComboBox('uncheckAll');
            }
            handleVariable = true;
        }
        else {
            handleVariable = false;
            $('#' + controlId).jqxComboBox('checkIndex', 0);
            var checkedItems = $('#' + controlId).jqxComboBox('getCheckedItems');
            var items = $('#' + controlId).jqxComboBox('getItems');

            if (checkedItems.length == 1)
                $('#' + controlId).jqxComboBox('uncheckIndex', 0);
            else if (items.length != checkedItems.length)
                $('#' + controlId).jqxComboBox('indeterminateIndex', 0);
            handleVariable = true;
        }
    }
    return true;
}

function ManageCheckAllSelection(controlId) {
    var items = $("#" + controlId).jqxComboBox('getCheckedItems');//first item
    var itemCode = "";
    if (items.length > 0 && items[0].label.toLowerCase() == "all") {
        $("#" + controlId).find("input[type=textarea]").val(items[0].label);
    }
}


function ManageCheckAllSelectionDropdownList(controlId) {
    var items = $("#" + controlId).jqxDropDownList('getCheckedItems');//first item
    var itemCode = "";
    if (items.length > 0 && items[0].label.toLowerCase() == "all") {
        $("#" + controlId).find("input[type=textarea]").val(items[0].label);
    }
}

function getTripSummary(OrderNo) {
    var strWinFeature = "menubar=no,toolbar=no,location=no,resizable=yes,scrollbars=yes,width=930 ,height=300,status=no,left=100,top=50"
    var strPopupURL = "/Reports/TripSummaryReport?&OrderNo=" + OrderNo;
    winNew = window.open(strPopupURL, "_blank", strWinFeature);
}

//*********************************************************************//
//*********************************************************************//

//Select 2 Auto Complete
function AutoCompleteBySelect(selectId, endPoint, MinimumInputLength, Placeholder, SearchObject, FormatObject, OnChangeCallback) {
    /// <summary>To Initialize Select2 Dropdown with static / dynamic autocomplete functionality.</summary>
    /// <param name="selectId" type="String">Select Control Id.</param>
    /// <param name="endPoint" type="String">Ajax Get Url to load dynamic data from database.</param>

    $("#" + selectId).select2({
        ajax: {
            quietMillis: 250,
            url: endPoint,
            dataType: 'json',
            data: function (data, page) {
                var jData = {};
                if (SearchObject.OptionalParaDetails != undefined) {
                    for (var i = 0; i < SearchObject.OptionalParaDetails.length; i++) {
                        jData[SearchObject.OptionalParaDetails[i].SerachId] = $(SearchObject.OptionalParaDetails[i].ValueControlId).val().trim();
                    }
                }
                jData[SearchObject.TermKeyId] = data.term
                return jData;
            },
            processResults: function (data) {
                return {
                    results: $.map(data, function (item) {
                        var arrayDetails = {};
                        if (FormatObject.Dispay.length == 1) {
                            arrayDetails.text = item[FormatObject.Dispay[0]];
                        } else if (FormatObject.Dispay.length == 2) {
                            if (FormatObject.Seprator == undefined)
                                arrayDetails.text = item[FormatObject.Dispay[0]] + " : " + item[FormatObject.Dispay[1]];
                            else
                                arrayDetails.text = item[FormatObject.Dispay[0]] + FormatObject.Seprator + item[FormatObject.Dispay[1]];
                        }
                        arrayDetails.id = item[FormatObject.Value];
                        return arrayDetails;
                    })
                };
            }
        },
        placeholder: Placeholder,
        minimumInputLength: MinimumInputLength,
        escapeMarkup: function (m) {
            return m;
        },
        positionDropdown: false
    }).on("change", function (e) {
        if (OnChangeCallback && typeof (OnChangeCallback) == "function") {
            OnChangeCallback(e);
        }
    });
}
//Select 2 Auto Complete
function AutoCompleteBySelect(selectId, endPoint, MinimumInputLength, Placeholder, SearchObject, FormatObject, OnChangeCallback) {
    /// <summary>To Initialize Select2 Dropdown with static / dynamic autocomplete functionality.</summary>
    /// <param name="selectId" type="String">Select Control Id.</param>
    /// <param name="endPoint" type="String">Ajax Get Url to load dynamic data from database.</param>

    $("#" + selectId).select2({
        ajax: {
            quietMillis: 250,
            url: endPoint,
            dataType: 'json',
            data: function (data, page) {
                var jData = {};
                if (SearchObject.OptionalParaDetails != undefined) {
                    for (var i = 0; i < SearchObject.OptionalParaDetails.length; i++) {
                        jData[SearchObject.OptionalParaDetails[i].SerachId] = $(SearchObject.OptionalParaDetails[i].ValueControlId).val().trim();
                    }
                }
                jData[SearchObject.TermKeyId] = data.term
                return jData;
            },
            processResults: function (data) {
                return {
                    results: $.map(data, function (item) {
                        var arrayDetails = {};
                        if (FormatObject.Dispay.length == 1) {
                            arrayDetails.text = item[FormatObject.Dispay[0]];
                        } else if (FormatObject.Dispay.length == 2) {
                            if (FormatObject.Seprator == undefined)
                                arrayDetails.text = item[FormatObject.Dispay[0]] + " : " + item[FormatObject.Dispay[1]];
                            else
                                arrayDetails.text = item[FormatObject.Dispay[0]] + FormatObject.Seprator + item[FormatObject.Dispay[1]];
                        }
                        arrayDetails.id = item[FormatObject.Value];
                        return arrayDetails;
                    })
                };
            }
        },
        placeholder: Placeholder,
        minimumInputLength: MinimumInputLength,
        escapeMarkup: function (m) {
            return m;
        },
        positionDropdown: false
    }).on("change", function (e) {
        if (OnChangeCallback && typeof (OnChangeCallback) == "function") {
            OnChangeCallback(e);
        }
    });
}
//END Select2


// Added Common Functions for Controls used in POD Management Modules
//*********************************************************************//
//*********************************************************************//
function BindDriverData() {
    $.ajax({
        url: '/POD/DetailList',
        type: 'POST',
        datatype: "json",
        data: JSON.stringify({ "customerId": "@SessionUtility.OrdersCompanyId" }),
        async: false,
        contentType: 'application/json; charset=utf-8',
        error: function (json, textStatus, errorThrown) {
        },
        success: function (data) {
            var arr = JSON.parse(data);
            arr.unshift({
                UserId: "0",
                Name: "ALL"
            });
            var source = {
                datatype: "json",
                localdata: arr,
                datafields: [
                    { name: 'Name', type: 'string' },
                    { name: 'UserId', type: 'string' }
                ]
            };
            for (var i = 0; i < arr.length; i++) {
                var strHtml = '<option value="' + arr[i].UserId + '">' + arr[i].Name + '</option>';
                $("#dvDriver").append(strHtml);
            }
            $("#dvDriver").select2({
                placeholder: "Select Driver"
            });
        }
    });
}

function BindComboBoxData() {
    $.ajax({
        url: '/api/WebAPI/GetLspList',
        type: 'POST',
        datatype: "json",
        data: JSON.stringify({ "customerId": "@SessionUtility.OrdersCompanyId" }),
        async: false,
        contentType: 'application/json; charset=utf-8',
        error: function (json, textStatus, errorThrown) {
        },
        success: function (data) {
            var arr = JSON.parse(data);
            arr.unshift({
                LspID: "0",
                LspName: "ALL"
            });
            var source = {
                datatype: "json",
                localdata: arr,
                datafields: [
                    { name: 'LspName', type: 'string' },
                    { name: 'LspID', type: 'string' }
                ]
            };
            for (var i = 0; i < arr.length; i++) {
                var strHtml = '<option value="' + arr[i].LspID + '">' + arr[i].LspName + '</option>';
                $("#dvLSP").append(strHtml);
            }
            $("#dvLSP").select2({
                placeholder: "Select Trasporter"
            });
        }
    });
}
//*********************************************************************//
//*********************************************************************//

// Added Common Functions for Top-up Modal used in Account Details & Release Notes Modules
//*********************************************************************//
//*********************************************************************//
function onChangePlanDetail(ddlPlanType) {
    if ($("#" + ddlPlanType.id).val() != "") {
        $.ajax({
            url: '/Account/LoadPlanTypeByPlanId',
            type: 'POST',
            datatype: "json",
            data: JSON.stringify({ PODPlanId: $("#" + ddlPlanType.id).val() }),
            async: false,
            contentType: 'application/json; charset=utf-8',
            error: function (json, textStatus, errorThrown) {

            },
            success: function (data) {
                data = JSON.parse(data);
                data = JSON.parse(data.Data);
                $("#topUpPlanName").text(data[0].TopUpPlanTypeName);
                $("#planAmount").text(data[0].PlanPrice);
                if (data[0].ValidTill == null) {
                    $("#planValidTill").text("-");
                }
                else {
                    $("#planValidTill").text(data[0].ValidTill);
                }

                $("#planNewBalance").text(data[0].CurrentPODcount + data[0].OrderCount);
                TotalOrder = data[0].PlanPrice;
                // $("#spnAmount").text(JSON.parse(data.Data))

                var amount = (baseamount * TotalOrder * SelectedMonth) - (TotalOrder * SelectedMonth * (discount / 100.00));

                var lblfinalvalue = parseInt(amount);
                saveAmount = lblfinalvalue;

                $("#topUpPlanName").text(data[0].TopUpPlanTypeName);
                $("#planAmount").text(lblfinalvalue);
                $("#planValidTill").text(data[0].ValidTill);
                $("#planNewBalance").text(data[0].CurrentPODcount + data[0].OrderCount);
            }
        });
    }
}

function changePeriod(ddlPeriod) {
    $.ajax({
        type: "POST",
        url: "/CompanyMaster/LoadAmountByPeriod",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({ "PlanId": ddlPeriod.value }),
        async: false,
        success: function (response) {
            if (response != "null") {
                var data = JSON.parse(response);
                if (data.ReturnCode > 0) {
                    var perOrderAmount = JSON.parse(data.Data);
                    SelectedMonth = perOrderAmount.TimeDuration;
                    var discount = perOrderAmount.Discount;
                    $("#topUpPlanDiscount").html(discount);

                    var amount = (baseamount * TotalOrder * SelectedMonth) - (TotalOrder * SelectedMonth * (discount / 100.00));

                    var lblfinalvalue = parseInt(amount);
                    saveAmount = lblfinalvalue;
                    $("#planAmount").text(lblfinalvalue);
                    //$("#spnAmount").text(lblfinalvalue);
                    //$("#dvAmountDetail").text("₹" + baseamount.toString() + " per order X " + TotalOrder + " orders X " + SelectedMonth.toString() + " months having "+discount+" % Discount = ₹" + saveAmount);
                }
            }
        },
        error: function (xhr, status, p3, p4) {
            var err = "Error " + " " + status + " " + p3 + " " + p4;
            if (xhr.responseText && xhr.responseText[0] == "{")
                err = JSON.parse(xhr.responseText).Message;
        }
    });
}

function OnclickNext() {
    var typeId = "";
    var typeName = "";
    var PaymentDone = "";
    var Amount = $("#planAmount").text();
    if (PaymentDone == "false") {
        return false;
    }

    typeId = $("#optRecipients").val();
    var planId = $('#optRecipients').val();

    if (typeId != "") {
        plan = "pro";
        typeName = "topup";
    }

    if (planId == "")
        planId = 1;


    if (Amount == "")
        Amount = 0;

    if (plan == "Starter")
        freeplan = true;
    else
        freeplan = false;

    var objParam = { "podPlanId": parseInt(planId), "paymentPlanId": parseInt(1), "amount": parseInt(Amount), "isfreeplan": freeplan, "typeName": typeName };
    debugger;
    $.ajax({
        type: "POST",
        url: "/Registration/Payment",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify(objParam),
        async: true,
        success: function (response) {

            var data = JSON.parse(response);

            if (data.ReturnCode > 0) {
                if (plan == "Starter") {
                    window.location.href = "/Default/Index";
                }
                else {
                    window.location.href = "/PaymentGateWay/Index";

                    $("#dvPaymentSuccess").css("display", "block");
                    $("#dvPro").css("display", "none");
                    $("#dvPaymentFailure").css("display", "none");
                }
            }
            else {
                $("#dvPaymentSuccess").hide();
                $("#dvPaymentFailure").show();
                ShowMessage("error", data.ReturnMessage);
            }
        },
        error: function (xhr, status, p3, p4) {
            //$.loader('close');
            var err = "Error " + " " + status + " " + p3 + " " + p4;
            if (xhr.responseText && xhr.responseText[0] == "{")
                err = JSON.parse(xhr.responseText).Message;
        }
    });

    //window.location.href = '/Registration/CompanyInfo?typeID=' + $("#optRecipients").val();
}
//*********************************************************************//
//*********************************************************************//

// Nested Modal Code   
$(document).ready(function () {
    $(document).on('show.bs.modal', '.modal', function (event) {
        var zIndex = 1040 + (10 * $('.modal:visible').length);
        $(this).css('z-index', zIndex);
        setTimeout(function () {
            $('.modal-backdrop').not('.modal-stack').css('z-index', zIndex - 1).addClass('modal-stack');
        }, 0);
    });
});

function onlyNumbers(evt) {
    var evt = (evt) ? evt : window.event
    var charCode = (evt.which) ? evt.which : evt.keyCode
    if (charCode == 46)
        return true;
    if (charCode > 31 && (charCode < 48 || charCode > 57))
        return false;

    return true;
}

function floatNumber(event) {
    if (event.which != 46 && (event.which < 47 || event.which > 59)) {
        event.preventDefault();
        if ((event.which == 46) && ($(this).indexOf('.') != -1)) {
            event.preventDefault();
        }
    }
}