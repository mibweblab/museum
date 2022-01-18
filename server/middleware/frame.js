const isUserLoggedIn = (req, res, next) => {
  if (!req.session.user) {
    res.status(400).json({
      error: "You are not logged in",
    });
  } else {
    next();
  }
};


module.exports = Object.freeze({isUserLoggedIn})