import Sequelize, { Model } from 'sequelize';

class File extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        path: Sequelize.STRING,
        url: {
          type: Sequelize.VIRTUAL,
          get() {
            // VARIAVEL AMBIENTE
            // return `http://localhost:7777/files/${this.path}`;
            return `http://localhost:3377/files/${this.path}`;
          },
        },
      },
      {
        sequelize,
        tableName: 'files',
        // eslint-disable-next-line comma-dangle
      }
    );

    return this;
  }
}

export default File;
