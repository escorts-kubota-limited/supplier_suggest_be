import { Model, DataTypes } from 'sequelize';

export default (sequelize) => {
  class Departments extends Model {}

  Departments.init(
   { id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  department_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  label: {
    type: DataTypes.STRING,
    allowNull: false,
  },},
    {
      sequelize,
      modelName: 'Departments',
      tableName: 'departments',
      timestamps: false,
    }
  );

  return Departments;
};
