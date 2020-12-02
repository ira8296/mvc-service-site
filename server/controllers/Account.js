const models = require('../models'); // Getting the models

const { Account } = models; // Instance of the model types

// Returns the login page
const loginPage = (req, res) => {
  res.render('login', { csrfToken: req.csrfToken(), signup: 'false' });
};

// Returns the signup page
const signupPage = (req, res) => {
  res.render('login', { csrfToken: req.csrfToken(), signup: 'true' });
};

// Returns the arcade page
const gamePage = (req, res) => {
  res.render('arcade', { csrfToken: req.csrfToken() });
};

// Returns the home page
const homePage = (req, res) => {
  res.render('home', { csrfToken: req.csrfToken() });
};

// Ends the user's session and returns to the home page
const logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};

// Starts up an existing session
const login = (request, response) => {
  const req = request;
  const res = response;

  // force cast to strings to cover some security flaws
  const username = `${req.body.username}`;
  const password = `${req.body.pass}`;

  if (!username || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  return Account.AccountModel.authenticate(username, password, (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'Wrong username or password' });
    }

    req.session.account = Account.AccountModel.toAPI(account);

    return res.json({ redirect: '/maker' });
  });
};

// Starts a new account along with a new session
const signup = (request, response) => {
  const req = request;
  const res = response;

  // cast to strings to cover up some security flaws
  req.body.username = `${req.body.username}`;
  req.body.pass = `${req.body.pass}`;
  req.body.pass2 = `${req.body.pass2}`;
  
  //Checks for any potential errors
  if (!req.body.username || !req.body.pass || !req.body.pass2) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (req.body.pass !== req.body.pass2) {
    return res.status(400).json({ error: 'Passwords do not match' });
  }

  Account.AccountModel.findByUsername(req.body.username, (err, doc) => {
    if (doc) {
      if (doc.username === req.body.username) {
        return res.status(400).json({ error: 'Account already exists' });
      }
    }
  });

  //Finalizes new account and saves it to the database
  return Account.AccountModel.generateHash(req.body.pass, (salt, hash) => {
    const accountData = {
      username: req.body.username,
      salt,
      password: hash,
    };

    const newAccount = new Account.AccountModel(accountData);

    const savePromise = newAccount.save();

    savePromise.then(() => {
      req.session.account = Account.AccountModel.toAPI(newAccount);
      return res.json({ redirect: '/maker' });
    });

    savePromise.catch((err) => {
      console.log(err);

      if (err.code === 11000) {
        return res.status(400).json({ redirect: '/maker' });
      }

      return res.status(400).json({ error: 'An error occurred' });
    });
  });
};

// Finds and retrieves CSRF token
const getToken = (request, response) => {
  const req = request;
  const res = response;

  const csrfJSON = {
    csrfToken: req.csrfToken(),
  };

  res.json(csrfJSON);
};

// Exports all necessary functions
module.exports.loginPage = loginPage;
module.exports.login = login;
module.exports.logout = logout;
module.exports.signupPage = signupPage;
module.exports.signup = signup;
module.exports.getToken = getToken;
module.exports.games = gamePage;
module.exports.homePage = homePage;
