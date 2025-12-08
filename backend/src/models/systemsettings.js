import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class SystemSettings extends Model {
    static associate(models) {
      // define association here
    }
  }
  SystemSettings.init({
    key: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    value: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'SystemSettings',
  });
  return SystemSettings;
};