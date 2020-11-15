const handleGame = e => {
  e.preventDefault();

  if ($("#gameTitle").val() == '' || $("#description").val() == '' || $("#screenShot").val() == '') {
    handleError("All fields are required");
    return false;
  }

  console.log($("#gameForm").serialize());
  sendAjax('POST', $("#gameForm").attr("action"), $("#gameForm").serialize(), function () {
    loadGamesFromServer();
  });
  return false;
};

const GameForm = props => {
  return /*#__PURE__*/React.createElement("form", {
    id: "gameForm",
    onSubmit: handleGame,
    name: "domoForm",
    action: "/maker",
    method: "POST",
    encType: "multipart/form-data",
    className: "gameForm"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "name"
  }, "Title: "), /*#__PURE__*/React.createElement("input", {
    id: "gameTitle",
    type: "text",
    name: "name",
    placeholder: "Game Title"
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "script"
  }, "Description: "), /*#__PURE__*/React.createElement("input", {
    id: "description",
    type: "text",
    name: "script",
    placeholder: "Game Description"
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "image"
  }, "Screenshot Image: "), /*#__PURE__*/React.createElement("input", {
    id: "gameTitle",
    type: "text",
    name: "name",
    placeholder: "Enter Image URL for game screenshot"
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "game"
  }, "Game File: "), /*#__PURE__*/React.createElement("input", {
    id: "gameFile",
    type: "file",
    name: "game"
  }), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: "_csrf",
    value: props.csrf
  }), /*#__PURE__*/React.createElement("input", {
    className: "gameSubmit",
    type: "submit",
    value: "Post Game"
  }));
};

const GameList = function (props) {
  if (props.games.length === 0) {
    return /*#__PURE__*/React.createElement("div", {
      className: "gameList"
    }, /*#__PURE__*/React.createElement("h3", {
      className: "emptyGame"
    }, "No Games yet"));
  }

  const gameNodes = props.games.map(function (game) {
    return /*#__PURE__*/React.createElement("div", {
      key: game._id,
      className: "game"
    }, /*#__PURE__*/React.createElement("img", {
      src: game.image,
      alt: "screenshot",
      className: "gameFace"
    }), /*#__PURE__*/React.createElement("h3", {
      className: "gameName"
    }, game.title), /*#__PURE__*/React.createElement("p", {
      className: "gamePlot"
    }, game.description), /*#__PURE__*/React.createElement("form", {
      ref: "downloadForm",
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
};

const loadGamesFromServer = () => {
  sendAjax('GET', '/getGames', null, data => {
    ReactDOM.render( /*#__PURE__*/React.createElement(GameList, {
      games: data.games
    }), document.querySelector("#games"));
  });
};

const setup = function (csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(GameForm, {
    csrf: csrf
  }), document.querySelector("#makeGames"));
  ReactDOM.render( /*#__PURE__*/React.createElement(GameList, {
    domos: []
  }), document.querySelector("#games"));
  loadGamesFromServer();
};

const getToken = () => {
  sendAjax('GET', '/getToken', null, result => {
    setup(result.csrfToken);
  });
};

$(document).ready(function () {
  getToken();
});
const handleError = message => {
  $("#errorMessage").text(message); //$("#domoMessage").animate({width:'toggle'},350);
};

const redirect = response => {
  //$("#domoMessage").animate({width:'hide'},350);
  window.location = response.redirect;
};

const sendAjax = (type, action, data, success) => {
  $.ajax({
    cache: false,
    type: type,
    url: action,
    data: data,
    dataType: "json",
    success: success,
    error: function (xhr, status, error) {
      var messageObj = JSON.parse(xhr.responseText);
      handleError(messageObj.error);
    }
  });
};
