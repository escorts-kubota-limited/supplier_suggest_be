import { Model, DataTypes } from 'sequelize';

export default (sequelize) => {
  class Suggestion extends Model {}

  Suggestion.init(
    {
      supplier_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      submitted_by: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      supplier_representative: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      designation: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      buyer_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      buyer_email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isEmail: true,
        },
      },
      department: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      improvement_category: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      idea: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      ekl_part_name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      ekl_part_description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      benefit: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      change_points: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      before_implementation: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      after_implementation: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      benefit_after_implementation: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      attachments: {
        type: DataTypes.JSON, // Array of file URLs
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'Suggestion',
      tableName: 'Suggestions',
      timestamps: true,
    }
  );

  return Suggestion;
};
