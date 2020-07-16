module.exports = function(sequelize, DataTypes) {
  //this will create our table of runner in mysql
  var runner = sequelize.define("runner", {
    name: DataTypes.STRING,
  
    lvl: DataTypes.INTEGER,
    ac: DataTypes.INTEGER,
    attack_power: DataTypes.INTEGER,
    health_points: DataTypes.INTEGER,
    cost: DataTypes.INTEGER,
    dice_value: DataTypes.INTEGER
  });

  return runner;
};
