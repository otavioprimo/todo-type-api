import { Router } from 'express';
import tokenRequired from '../authRoute';

import tasksController from './tasks.controller';

const router: Router = Router();

router.get('/', tokenRequired, tasksController.buscarTodas);
router.get('/desginadas-para-usuario', tokenRequired, tasksController.buscarDesignadasParaUsuario);
router.get('/desginadas-pelo-usuario', tokenRequired, tasksController.buscarDesignadasPeloUsuario);
router.get('/:id', tokenRequired, tasksController.buscarPorId);

router.post('/', tokenRequired, tasksController.adicionar);

router.put('/lista/check/:id', tokenRequired, tasksController.checkLista)
router.put('/lista/:id', tokenRequired, tasksController.alterarLista);
router.put('/:id', tokenRequired, tasksController.alterar);

router.delete('/lista/:id', tokenRequired, tasksController.deletarItemLista);
router.delete('/:id', tokenRequired, tasksController.deletar);


export default router;