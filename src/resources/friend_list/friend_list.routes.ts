import { Router } from 'express';
import tokenRequired from '../authRoute';

import friendListController from './friend_list.controller';

const router: Router = Router();

router.get('/', tokenRequired, friendListController.buscarAmigos);

router.delete('/', tokenRequired, friendListController.deletarAmigo);

export default router;