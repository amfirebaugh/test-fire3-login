
 module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define("User", {
    firstname: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1]
        }
    },
    lastname: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1]
        }
    },
    age: {
      // age range is string example:  '10 - 19'
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1]
        }
    },
    sex: {
      type: DataTypes.STRING,
      allowNull: false
      /*
      // custom validate for 'f' or 'm'
      validate: {
        startsWith:function(bodyVal) {
          var first = bodyVal.charAt(0);
          if (first !== 'f' || first !== 'm'){
            throw new Error("First character of body must be upper");
          }    
        }
      }*/
    },
    email: {
      type: DataTypes.STRING,
      // set primary key
      primaryKey: true,
      allowNull: false,
      validate: {
        isEmail: true
      }
    }
  });

  User.associate = function(models) {
    // Associating User with Drugs
    // When an User is deleted, also delete any associated Drugs
    User.hasMany(models.Drug, {
      onDelete: "cascade"
    });
  };

  return User;
};