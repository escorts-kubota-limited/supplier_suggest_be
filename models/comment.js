import { Model, DataTypes } from "sequelize";

export default (sequelize) => {
  class Comments extends Model {}

  Comments.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      submitted_by : {
        type: DataTypes.STRING,
        allowNull: false,
      },
      suggestion_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Suggestions", // Name of the related table
          key: "id",
        },
        onDelete: "CASCADE", // Delete comments if suggestion is deleted
      },
      text: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      attachment : {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Comments",
      tableName: "comments",
      timestamps: true,
    }
  );

  return Comments;
};
