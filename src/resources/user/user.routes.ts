import UserController from './user.controllers';
import { Router, Request, Response } from 'express';
import tokenRequired from '../authRoute';

const router: Router = Router();

router.get('/', tokenRequired, UserController.getPerfilById);
router.post('/', UserController.cadastrar)
router.post('/login', UserController.login);
router.get('/:username', tokenRequired, UserController.getByUsername);
router.get('/search/username', tokenRequired, UserController.searchByUsername);

export default router;