const db = require("../models");

const passport = require("../config/passport");

module.exports = (app) => {
  //this portion of code is all for passport to work

  app.post("/api/login", passport.authenticate("local"), (req, res) => {

    //sent back the current logged in users data
    const user = {
      id: req.user.id
    };
    res.json(user);
  });

  // user game
  app.post("/api/game", (req, res) => {
    db.User.create(req.body).then((data) => {
      res.json(data);
    });
  });

  // attach user to game
  app.get("/api/game", (req, res) => {
    db.User.findAll({
      where: {
        id: req.user.id
      }
    }).then((data) => {
      res.json(data);
    });
  });

  //allows us to update the currently signed in users points
  app.put("/api/game", (req, res) => {
    db.User.update(
      {
        score: req.body.score,
        lvl: req.body.lvl,
      },
      {
        where: {
          id: req.user.id
        }
      }
    ).then((data) => {
      res.json(data);
    });
  });

  app.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
  });
};