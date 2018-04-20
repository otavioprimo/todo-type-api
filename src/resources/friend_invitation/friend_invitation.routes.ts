import tokenRequired from '../authRoute';
import { Router } from 'express';
import FriendInvitationController from './friend_invitation.controller';

const router: Router = Router();

router.get('/pendentes', tokenRequired, FriendInvitationController.convitesPendentes);

router.post('/pedido-amigo', tokenRequired, FriendInvitationController.enviarConvite);
router.post('/aceitar-recusar', tokenRequired, FriendInvitationController.aceitarRecusarConvite);

export default router;