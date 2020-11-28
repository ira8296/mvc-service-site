//Prints and displayS any user errors
const handleError = (message) => {
    $("#errorMessage").text(message);
};

//Redirects the window depending on which link is clicked
const redirect = (response) => {
    //$("#domoMessage").animate({width:'hide'},350);
    window.location = response.redirect;
};

//Sends AJAX requests
const sendAjax = (type, action, data, success) => {
    $.ajax({
        cache: false,
        type: type,
        url: action,
        data: data,
        dataType: "json",
        success: success,
        error: function(xhr, status, error) {
            var messageObj = JSON.parse(xhr.responseText);
            handleError(messageObj.error);
        }
    });
};

//Dictates the file uploading process
const fileUpload = (action, data, success) => {
    $.ajax({
        cache: false,
        type: "POST",
        url: action,
        data: data,
        processData: false,
        contentType: false,
        success: success,
        error: (xhr, status, error) => {
            const messageObj = JSON.parse(xhr.responseText);
            handleError(messageObj.error);
        }
    });
};