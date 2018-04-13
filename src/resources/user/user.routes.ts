import UserController from './user.controllers';
import { Router, Request, Response } from 'express';

const router: Router = Router();

router.get('/', UserController.testeEmail);

export default router;