/* eslint-disable comma-dangle */
import { Model } from 'sequelize';

class Inscription extends Model {
  static init(sequelize) {
    super.init(
      {},
      {
        sequelize,
        tableName: 'inscriptions',
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.Meetup, { foreignKey: 'meetup_id' });
    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user_meetup' });
  }
}

export default Inscription;
