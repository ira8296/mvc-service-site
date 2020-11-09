const handleGame = (e) => {
    e.preventDefault();
    
    if($("#gameTitle").val() == '' || $("#description").val() == '' || $("#screenShot").val() == '') {
        handleError("All fields are required");
        return false;
    }
    console.log($("#gameForm").serialize());
    sendAjax('POST', $("#gameForm").attr("action"), $("#gameForm").serialize(), function() {
        loadGamesFromServer();
    });
    
    return false;
};

const GameForm = (props) => {
    return (
        <form id="gameForm"
              onSubmit={handleGame}
              name="domoForm"
              action="/maker"
              method="POST"
              encType="multipart/form-data"
              className="gameForm"
        >
            <label htmlFor="name">Title: </label>
            <input id="gameTitle" type="text" name="name" placeholder="Game Title"/>
            <label htmlFor="script">Description: </label>
            <input id="description" type="text" name="script" placeholder="Game Description"/>
            <label htmlFor="image">Screenshot Image: </label>
            <input id="gameTitle" type="text" name="name" placeholder="Enter Image URL for game screenshot"/>
            <label htmlFor="game">Game File: </label>
            <input id="gameFile" type="file" name="game"/>
            <input type="hidden" name="_csrf" value={props.csrf} />
            <input className="gameSubmit" type="submit" value="Post Game" />
        </form>
    );
};

const GameList = function(props) {
    if(props.games.length === 0) {
        return (
            <div className="gameList">
                <h3 className="emptyGame">No Games yet</h3>
            </div>
        );
    }
    
    const gameNodes = props.games.map(function(game) {
        return (
            <div key={game._id} className="game">
                <img src={game.image} alt="screenshot" className="gameFace" />
                <h3 className="gameName">{game.title}</h3>
                <p className="gamePlot">{game.description}</p>
                <form ref='downloadForm' id='downloadForm' action='/download' method='get'>
                    <input type="hidden" name='fileId' value={game.file} />
                    <input type='submit' value='Download'/>
                </form>
            </div>
        );
    });
    
    return (
        <div className="gameList">
            {gameNodes}
        </div>
    );
};

const loadGamesFromServer = () => {
    sendAjax('GET', '/getGames', null, (data) => {
        ReactDOM.render(
            <GameList games={data.games} />, document.querySelector("#games")
        );
    });
};

const setup = function(csrf) {
    ReactDOM.render(
        <GameForm csrf={csrf} />, document.querySelector("#makeGames")
    );
    
    ReactDOM.render(
        <GameList domos={[]} />, document.querySelector("#games")
    );
    
    loadGamesFromServer();
};

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

$(document).ready(function() {
    getToken();
});