import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';

import authMiddleware from './app/middleware/auth';
import MeetupController from './app/controllers/MeetupController';
import InscriptionController from './app/controllers/InscriptionController';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);

routes.put('/users', UserController.update);

routes.get('/meetups', MeetupController.index);
routes.put('/meetups', MeetupController.update);
routes.post('/meetups', MeetupController.store);
routes.post('/meetups/:id/inscriptions', InscriptionController.store);
routes.delete('/meetups/:id', MeetupController.delete);

routes.post('/files', upload.single('file'), FileController.store);

routes.get('/inscriptions', InscriptionController.index);

export default routes;
