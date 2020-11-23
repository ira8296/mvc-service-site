const handleError = (message) => {
  $("#errorMessage").text(message);
}

const sendAjax = (action, data) => {
  $.ajax({
    cache: false,
    type: "POST",
    url: action,
    data: data,
    dataType: "json",
    success: (result, status, xhr) => {

      window.location = result.redirect;
    },
    error: (xhr, status, error) => {
      const messageObj = JSON.parse(xhr.responseText);

      handleError(messageObj.error);
    }
  });        
}

$(document).ready(() => {
  $("#signupForm").on("submit", (e) => {
    e.preventDefault();


    if($("#user").val() == '' || $("#pass").val() == '' || $("#pass2").val() == '') {
      handleError("All fields are required");
      return false;
    }

    if($("#pass").val() !== $("#pass2").val()) {
      handleError("Passwords do not match");
      return false;           
    }

    sendAjax($("#signupForm").attr("action"), $("#signupForm").serialize());

    return false;
  });

  $("#loginForm").on("submit", (e) => {
    e.preventDefault();


    if($("#user").val() == '' || $("#pass").val() == '') {
      handleError("Username or password is empty");
      return false;
    }

    sendAjax($("#loginForm").attr("action"), $("#loginForm").serialize());

    return false;
  });
  
  $("#gameForm").on("submit", (e) => {
    e.preventDefault();


    if($("#gameTitle").val() == '' || $("#description").val() == '') {
      handleError("All fields are required");
      return false;
    }

    sendAjax($("#gameForm").attr("action"), $("#gameForm").serialize());

    return false;
  });
});
