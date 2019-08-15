import { isBefore } from 'date-fns';
import { Op } from 'sequelize';

import User from '../models/User';
import Meetup from '../models/Meetup';
import Inscription from '../models/Inscription';
import Mail from '../lib/Mail';

class InscriptionController {
  async index(req, res) {
    const inscriptions = await Inscription.findAll({
      where: {
        user_id: req.userId,
      },
      include: [
        {
          model: Meetup,
          where: {
            date: {
              [Op.gt]: new Date(),
            },
          },
          required: true,
        },
      ],
      order: [[Meetup, 'date']],
    });

    return res.json(inscriptions);
  }

  async store(req, res) {
    const meetup = await Meetup.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'user_meetup',
          attributes: ['name', 'email'],
        },
      ],
    });

    const user = await User.findByPk(req.userId);

    if (isBefore(meetup.date, new Date())) {
      return res
        .status(401)
        .json({ error: ' inscribe past date are not permited' });
    }

    const verifyDateMeetup = await Inscription.findOne({
      where: {
        user_id: user.id,
      },
      include: [
        {
          model: Meetup,
          where: {
            date: meetup.date,
          },
        },
      ],
    });

    if (verifyDateMeetup) {
      return res.status(401).json({
        error: 'inscribe in two meetups in same time is not permited',
      });
    }

    const inscription = await Inscription.create({
      user_id: user.id,
      meetup_id: meetup.id,
    });

    // sending email
    await Mail.sendMail({
      to: `${meetup.user_meetup.name} <${meetup.user_meetup.email}>`,
      subject: 'Inscrição em meeup',
      template: 'inscription',
    });

    return res.json(inscription);
  }
}

export default new InscriptionController();
