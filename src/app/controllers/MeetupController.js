/* eslint-disable prettier/prettier */
/* eslint-disable comma-dangle */
/* eslint-disable indent */
/* eslint-disable no-trailing-spaces */
import * as Yup from 'yup';
import Meetup from '../models/Meetup';

class MeetupController {
  async store(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      description: Yup.string().required(),
      file_id: Yup.string().required(),
      user_id: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'validation fails' });
    }

    const { id, title, description } = await Meetup.create(req.body);

    return res.json({
      id,

      title,
      description,
    });
  }
}

export default new MeetupController();
