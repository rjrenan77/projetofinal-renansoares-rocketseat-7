import { Router } from 'express';

import User from './app/models/User';

const routes = new Router();

routes.get('/', async (req, res) => {
  const user = await User.create({
    name: 'Renan SOares',
    email: 'renan@renan',
    password_hash: '2345',
  });

  return res.json(user);
});

export default routes;
