import { Model, DataTypes } from 'sequelize';

export default (sequelize) => {
    class EsclationMatrix extends Model {}
  
    EsclationMatrix.init(
     {
        
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: true
        },
        reportingManager: {
            type: DataTypes.STRING,
            allowNull: true
        },
        reportingManagerName: {
            type: DataTypes.STRING,
            allowNull: true
        },
        skipManager: {
            type: DataTypes.STRING,
            allowNull: false
        },
         skipManagerName: {
            type: DataTypes.STRING,
            allowNull: true
        },
      

},
      {
        sequelize,
        modelName: 'EsclationMatrix',
        tableName: 'EsclationMatrix',
        timestamps: false,
      }
    );
  
    return EsclationMatrix;
  };
  


