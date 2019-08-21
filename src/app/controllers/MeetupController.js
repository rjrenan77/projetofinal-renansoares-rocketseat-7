/* eslint-disable prettier/prettier */
/* eslint-disable comma-dangle */
/* eslint-disable indent */
/* eslint-disable no-trailing-spaces */
import * as Yup from 'yup';
import { Op } from 'sequelize';
import {
 isBefore, startOfDay, endOfDay, parseISO, startOfHour
} from 'date-fns';
import Meetup from '../models/Meetup';
import File from '../models/File';
import User from '../models/User';

class MeetupController {
  async index(req, res) {
    const where = {};
    const page = req.query.page || 1;

    if (req.query.date) {
      const searchDate = parseISO(req.query.date);

      where.date = {
        [Op.between]: [startOfDay(searchDate), endOfDay(searchDate)],
      };
    }

    const meetups = await Meetup.findAll({
      where,
      order: ['date'],
      attributes: ['id', 'title', 'description', 'location', 'date'],
      include: [
        { model: User, as: 'user_meetup' },
        {
          model: File,
          as: 'banner',
          attributes: ['id', 'name', 'path', 'url'],
        },
      ],
      limit: 10,
      offset: 10 * page - 10,
    });

    return res.json(meetups);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      description: Yup.string().required(),
      location: Yup.string().required(),
      date: Yup.date().required(),
      file_id: Yup.string().required(),
      user_id: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'validation fails' });
    }

    const { date } = req.body;

    // verifying date
    const hourStart = startOfHour(parseISO(date));

    if (isBefore(hourStart, new Date())) {
      return res.status(400).json({ error: 'past date are not permited' });
    }

    const { id, title, description } = await Meetup.create(req.body);

    return res.json({
      id,

      title,
      description,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string(),
      description: Yup.string(),
      location: Yup.string(),
      date: Yup.date(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'validation fails' });
    }

    const meetupExists = await Meetup.findOne({ user_id: req.userId });

    if (!meetupExists) {
      return res.status(400).json({ error: 'There are no meetups for this user' });
    }

    const { id, title } = await meetupExists.update(req.body);

    return res.json({ id, title });
  }

  async delete(req, res) {
    const meetup = await Meetup.findByPk(req.params.id);

    if (meetup.user_id !== req.userId) {
      return res.status(401).json({ error: 'You dont have permission to cancel this meetup' });
    }

    // verifying date

    if (isBefore(meetup.date, new Date())) {
      return res.status(400).json({ error: 'you cannot cancel a meetup from a past date' });
    }

    // deleting meetup
    await Meetup.destroy({ where: { id: req.params.id } });
    return res.json();
  }

  async indexOne(req, res) {
    const meetup = await Meetup.findByPk(req.params.id);

    if (meetup.user_id !== req.userId) {
      return res.status(401).json({ error: 'You dont have permission to cancel this meetup' });
    }

    return res.json(meetup);
  }
}

export default new MeetupController();
