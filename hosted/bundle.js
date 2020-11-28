"use strict";

//Handles the game posting process
var handleGame = function handleGame(e) {
  e.preventDefault(); //Checks if all the fields are filled in

  if ($("#gameTitle").val() == '' || $("#description").val() == '' || $("#screenShot").val() == '') {
    handleError("All fields are required");
    return false;
  } //Instances of the game form and form data


  var gameForm = document.getElementById('gameForm');
  var formData = new FormData(gameForm);
  console.dir(gameForm);
  console.dir(formData); //Loads the game upon file upload

  fileUpload($("#gameForm").attr("action"), formData, function () {
    loadGamesFromServer();
  });
  return false;
}; //Builds the form needed for posting games


var GameForm = function GameForm(props) {
  return /*#__PURE__*/React.createElement("form", {
    id: "gameForm",
    onSubmit: handleGame,
    name: "domoForm",
    action: "/maker",
    method: "POST",
    encType: "multipart/form-data",
    className: "gameForm"
  }, /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "name"
  }, "Title: "), /*#__PURE__*/React.createElement("input", {
    id: "gameTitle",
    type: "text",
    name: "name",
    placeholder: "Game Title"
  })), /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "script"
  }, "Description: "), /*#__PURE__*/React.createElement("input", {
    id: "description",
    type: "text",
    name: "script",
    placeholder: "Game Description"
  })), /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "image"
  }, "Screenshot Image: "), /*#__PURE__*/React.createElement("input", {
    id: "gameScreenshot",
    type: "file",
    name: "image"
  })), /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "game"
  }, "Game File: "), /*#__PURE__*/React.createElement("input", {
    id: "gameFile",
    type: "file",
    name: "game"
  })), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: "_csrf",
    value: props.csrf
  }), /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("input", {
    className: "gameSubmit",
    type: "submit",
    value: "Post Game"
  })), /*#__PURE__*/React.createElement("div", {
    id: "devMessage"
  }, /*#__PURE__*/React.createElement("p", {
    id: "errorMessage"
  })));
}; //Displays the list of games to the screen


var GameList = function GameList(props) {
  if (props.games.length === 0) {
    return /*#__PURE__*/React.createElement("div", {
      className: "gameList"
    }, /*#__PURE__*/React.createElement("h3", {
      className: "emptyGame"
    }, "No Games yet"));
  } //Builds the nodes which make up the list


  var gameNodes = props.games.map(function (game) {
    var imgString = "/download?fileId=".concat(game.image);
    return /*#__PURE__*/React.createElement("div", {
      key: game._id,
      className: "game"
    }, /*#__PURE__*/React.createElement("img", {
      src: imgString,
      alt: "screenshot",
      className: "gameFace"
    }), /*#__PURE__*/React.createElement("h3", {
      className: "gameName"
    }, game.title), /*#__PURE__*/React.createElement("p", {
      className: "gamePlot"
    }, game.description), /*#__PURE__*/React.createElement("form", {
      id: "downloadForm",
      action: "/download",
      method: "get"
    }, /*#__PURE__*/React.createElement("input", {
      type: "hidden",
      name: "fileId",
      value: game.file
    }), /*#__PURE__*/React.createElement("input", {
      type: "submit",
      value: "Download"
    })));
  });
  return /*#__PURE__*/React.createElement("div", {
    className: "gameList"
  }, gameNodes);
}; //Retrieves all of the games stored within the database


var loadGamesFromServer = function loadGamesFromServer() {
  sendAjax('GET', '/getGames', null, function (data) {
    console.dir(data);
    ReactDOM.render( /*#__PURE__*/React.createElement(GameList, {
      games: data.games
    }), document.querySelector("#games"));
  });
}; //Sets up the arcade page


var setup = function setup(csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(GameForm, {
    csrf: csrf
  }), document.querySelector("#makeGames"));
  ReactDOM.render( /*#__PURE__*/React.createElement(GameList, {
    games: []
  }), document.querySelector("#games"));
  loadGamesFromServer();
}; //Retrieves the CSRF token and sets up the page


var getToken = function getToken() {
  sendAjax('GET', '/getToken', null, function (result) {
    setup(result.csrfToken);
  });
}; //Upon loading, all of the page elements are set up


$(document).ready(function () {
  getToken();
});
"use strict";

//Prints and displayS any user errors
var handleError = function handleError(message) {
  $("#errorMessage").text(message);
}; //Redirects the window depending on which link is clicked


var redirect = function redirect(response) {
  //$("#domoMessage").animate({width:'hide'},350);
  window.location = response.redirect;
}; //Sends AJAX requests


var sendAjax = function sendAjax(type, action, data, success) {
  $.ajax({
    cache: false,
    type: type,
    url: action,
    data: data,
    dataType: "json",
    success: success,
    error: function error(xhr, status, _error) {
      var messageObj = JSON.parse(xhr.responseText);
      handleError(messageObj.error);
    }
  });
}; //Dictates the file uploading process


var fileUpload = function fileUpload(action, data, success) {
  $.ajax({
    cache: false,
    type: "POST",
    url: action,
    data: data,
    processData: false,
    contentType: false,
    success: success,
    error: function error(xhr, status, _error2) {
      var messageObj = JSON.parse(xhr.responseText);
      handleError(messageObj.error);
    }
  });
};
