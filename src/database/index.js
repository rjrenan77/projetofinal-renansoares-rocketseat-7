/* eslint-disable prettier/prettier */
import Sequelize from 'sequelize';
import dabaseConfig from '../config/database';

import Inscription from '../app/models/Inscription';
import User from '../app/models/User';
import File from '../app/models/File';
import Meetup from '../app/models/Meetup';

const models = [User, File, Meetup, Inscription];

class Database {
  constructor() {
    this.connection = new Sequelize(dabaseConfig);
    this.init();
    this.associate();
  }

  init() {
    models.forEach(model => model.init(this.connection));
  }

  associate() {
    models.forEach((model) => {
      if (model.associate) {
        model.associate(this.connection.models);
      }
    });
  }
}

export default new Database();
