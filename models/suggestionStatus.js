import { Model, DataTypes } from 'sequelize';

export default (sequelize) => {
  class SuggestionStatus extends Model {}

  SuggestionStatus.init(
   { id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  suggestion_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "Suggestions", // Name of the related table
      key: "id",
    },
    onDelete: "CASCADE", // Delete status if suggestion is deleted
  },
  status: {
    type: DataTypes.ENUM("in review", "approved", "declined"),
    allowNull: false,
    defaultValue: "in review", // Default status
  },},
    {
      sequelize,
      modelName: 'SuggestionStatus',
      tableName: 'suggestion_statuses',
      timestamps: true,
    }
  );

  return SuggestionStatus;
};
