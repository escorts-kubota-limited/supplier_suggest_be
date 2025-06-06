import { Model, DataTypes } from "sequelize";

export default (sequelize) => {
  class Messages extends Model {}
  Messages.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      receiver_id : {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      body: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status : {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue : false
      },
    },
    {
      sequelize,
      modelName: "Messages",
      tableName: "Messages",
      timestamps: true,
    }
  );

  return Messages;
};
