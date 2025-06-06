import { Sequelize } from 'sequelize';
import userModel from './user.js';
import suggestionModel from './suggestion.js';
import suggestionStatusModel from './suggestionStatus.js';
import commentModel from './comment.js'
import departmentModel from './departments.js';
import deviceModel from './devices.js';
import messageModel from './messages.js';
import escalationModel from './escalationMatrix.js';
import dotenv from 'dotenv';

dotenv.config();

import configFile from '../config/config.json' with { type: 'json' };


const env = process.env.NODE_ENV ;

const config = configFile[env];

console.log(config);

const sequelize = new Sequelize(config.database, config.username, config.password, config);


const models = {
  User: userModel(sequelize),
  Suggestion : suggestionModel(sequelize),
  SuggestionStatus : suggestionStatusModel(sequelize),
  Comments : commentModel(sequelize),
  Departments : departmentModel(sequelize),
  Device : deviceModel(sequelize),
  Messages : messageModel(sequelize),
  EsclationMatrix : escalationModel(sequelize)
};

export { sequelize };
export default models;
