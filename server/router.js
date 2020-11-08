const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  app.get('/download', mid.requiresSecure, mid.requiresLogin, controllers.Game.download);
  app.get('/getToken', mid.requiresSecure, controllers.Account.getToken);
  app.get('/getGames', mid.requiresLogin, controllers.Game.getGames);
  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);
  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);
  app.get('/arcade', mid.requiresSecure, controllers.Account.games);
  app.get('/logout', mid.requiresLogin, controllers.Account.logout);
  app.get('/maker', mid.requiresLogin, controllers.Game.posterPage);
  app.post('/maker', mid.requiresLogin, controllers.Game.post);
  app.get('/home', mid.requiresSecure, controllers.Account.homePage);
  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.homePage);
};

module.exports = router;