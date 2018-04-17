import UserController from './user.controllers';
import { Router, Request, Response } from 'express';
import tokenRequired from '../authRoute';

const router: Router = Router();

router.post('/', UserController.cadastrar)
router.get('/perfil', tokenRequired, UserController.getPerfilById);
router.post('/login', UserController.login);
router.get('/:username', tokenRequired, UserController.getByUsername);
router.get('/search/username', tokenRequired, UserController.searchByUsername);
router.post('/confirmar-email', UserController.confirmarEmail);
router.post('/enviar-confirmar-email', tokenRequired, UserController.enviarConfirmarEmail);
router.post('/enviar-recuperar-senha', tokenRequired, UserController.recuperarSenha);

export default router;