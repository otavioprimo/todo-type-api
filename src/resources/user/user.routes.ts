import UserController from './user.controllers';
import { Router, Request, Response } from 'express';
import tokenRequired from '../authRoute';

const router: Router = Router();

router.get('/perfil', tokenRequired, UserController.getPerfilById);
router.get('/:username', tokenRequired, UserController.getByUsername);
router.get('/search/username', tokenRequired, UserController.searchByUsername);

router.post('/', UserController.cadastrar)
router.post('/login', UserController.login);
router.post('/confirmar-email', UserController.confirmarEmail);
router.post('/enviar-confirmar-email', tokenRequired, UserController.enviarConfirmarEmail);
router.post('/enviar-recuperar-senha', tokenRequired, UserController.recuperarSenha);

router.put('/', tokenRequired, UserController.atualizar);
router.put('/alterar-foto', tokenRequired, UserController.atualizarFoto);
router.put('/atualizar-senha', tokenRequired, UserController.atualizarSenha);
router.put('/atualizar-recuperar-senha', tokenRequired, UserController.atualizarRecuperarSenha);

export default router;