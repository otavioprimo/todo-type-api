export interface ITask {
    adicionar(req, res): void;
    alterar(req, res): void;
    alterarLista(req, res): void;
    checkLista(req, res): void;
    deletar(req, res): void;
    buscarTodas(req, res): void;
    buscarPorId(req, res): void;
    buscarDesignadasParaUsuario(req, res): void;
    buscarDesignadasPeloUsuario(req, res): void;
}