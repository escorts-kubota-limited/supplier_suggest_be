import { Model, DataTypes } from 'sequelize';

export default (sequelize) => {
    class Devices extends Model {}
  
    Devices.init(
     {
        
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        phone_number: {
            type: DataTypes.STRING,
            allowNull: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: true
        },
        firebase_token: {
            type: DataTypes.STRING,
            allowNull: false
        },
        device_name: {
            type: DataTypes.STRING,
            allowNull: false
        }

},
      {
        sequelize,
        modelName: 'Devices',
        tableName: 'Devices',
        timestamps: false,
      }
    );
  
    return Devices;
  };
  


