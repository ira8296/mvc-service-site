const handleGame = (e) => {
    e.preventDefault();
    
    if($("#gameTitle").val() == '' || $("#description").val() == '' || $("#screenShot").val() == '') {
        handleError("All fields are required");
        return false;
    }
    
    let gameForm = document.getElementById('gameForm');
    let formData = new FormData(gameForm);
    console.dir(gameForm);
    
    console.dir(formData);
    
    fileUpload($("#gameForm").attr("action"), formData, function() {
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
            <div className="field">
                <label htmlFor="name">Title: </label>
                <input id="gameTitle" type="text" name="name" placeholder="Game Title"/>
            </div>
            <div className="field">
                <label htmlFor="script">Description: </label>
                <input id="description" type="text" name="script" placeholder="Game Description"/>
            </div>
            <div className="field">
                <label htmlFor="image">Screenshot Image: </label>
                <input id="gameScreenshot" type="file" name="image"/>
            </div>
            <div className="field">
                <label htmlFor="game">Game File: </label>
                <input id="gameFile" type="file" name="game"/>
            </div>
            <input type="hidden" name="_csrf" value={props.csrf} />
            <div className="field">
                <input className="gameSubmit" type="submit" value="Post Game" />
            </div>
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
        let imgString = `/download?fileId=${game.image}`;
        return (
            <div key={game._id} className="game">
                <img src={imgString} alt="screenshot" className="gameFace" />
                <h3 className="gameName">{game.title}</h3>
                <p className="gamePlot">{game.description}</p>
                <form id='downloadForm' action='/download' method='get'>
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
        console.dir(data);
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
        <GameList games={[]} />, document.querySelector("#games")
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