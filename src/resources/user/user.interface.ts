import { Router, Request, Response } from 'express';

export interface IUserController {
    cadastrar(req: Request, res: Response): void;
    login(req: Request, res: Response): void;
    loginGoogle(req: Request, res: Response): void;
    atualizar(req: Request, res: Response): void;
    atualizarFoto(req: Request, res: Response): void;
    atualizarSenha(req: Request, res: Response): void;
    confirmarEmail(req: Request, res: Response): void;
    enviarConfirmarEmail(req: Request, res: Response): void;
    recuperarSenha(req: Request, res: Response): void;
    getPerfilById(req: Request, res: Response): void;
    getUsuariosFiltro(req: Request, res: Response): void;
    getByUsername(req: Request, res: Response): void;
    searchByUsername(req: Request, res: Response): void;
}