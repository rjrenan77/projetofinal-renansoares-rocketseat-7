import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';

import authMiddleware from './app/middleware/auth';
import MeetupController from './app/controllers/MeetupController';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);

routes.get('/meetups', MeetupController.index);

routes.put('/users', UserController.update);
routes.put('/meetups', MeetupController.update);

routes.post('/meetups', MeetupController.store);
routes.post('/files', upload.single('file'), FileController.store);

routes.delete('/meetups/:id', MeetupController.delete);

export default routes;
