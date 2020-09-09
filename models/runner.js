module.exports = function(sequelize, DataTypes) {
  //this will create our table of runner in mysql
  var runner = sequelize.define("runner", {
    name: DataTypes.STRING,
    lvl: DataTypes.INTEGER,
    Points: DataTypes.INTEGER,
    cost: DataTypes.INTEGER,
   
  });

  return runner;
};
