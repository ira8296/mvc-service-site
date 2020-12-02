// Pulls in the controllers and middleware
const controllers = require('./controllers');
const mid = require('./middleware');

// Teh router which allows for directory between pages
const router = (app) => {
  app.get('/download', mid.requiresSecure, mid.requiresLogin, controllers.Game.download);
  app.get('/getToken', mid.requiresSecure, controllers.Account.getToken);
  app.get('/getGames', mid.requiresLogin, controllers.Game.getGames);
  app.get('/getAllGames', mid.requiresLogin, controllers.Game.getAll);
  app.get('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signupPage);
  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);
  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);
  app.get('/arcade', mid.requiresLogin, controllers.Account.games);
  app.get('/logout', mid.requiresLogin, controllers.Account.logout);
  app.get('/maker', mid.requiresLogin, controllers.Game.posterPage);
  app.post('/maker', mid.requiresLogin, controllers.Game.post);
  app.get('/home', mid.requiresSecure, controllers.Account.homePage);
  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.homePage);
};

// Exports the router
module.exports = router;
