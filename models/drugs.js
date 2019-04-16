module.exports = function(sequelize, DataTypes) {
    var Drug = sequelize.define("Drug", {
      drugname1: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [1]
        }
      },
      drugname2: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [1]
        }
      },
      // adding primary key so we dont get duplicate combos
      drugCombo: {
        type: DataTypes.STRING,
        // set primary key
        primaryKey: true,
        allowNull: false,
        validate: {
          len: [1]
        }
      }


      /*
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isEmail: true
        }
      }
      */
    });
  
    Drug.associate = function(models) {
      /* 
        Drug should belong to a User
        A Drug can't be created without a User due to the foreign key constraint

        By default the foreign key for a belongsTo relation will be generated from the target model name and the target primary key name
        In all cases the default foreign key can be overwritten with the foreignKey option. When the foreign key option is used

        The target key is the column on the target model that the foreign key column on the source model points to. By default the target key for a belongsTo relation will be the target model's primary key. To define a custom column, use the targetKey option.
        
        Setting the key constraint explicitly below for self documenting purposes
      */
      Drug.belongsTo(models.User, {foreignKey: 'drug_ibfk_1'});
    };
  
    return Drug;
  };

 