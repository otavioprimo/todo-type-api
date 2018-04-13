import { Router, Request, Response } from 'express';

export interface IUserController {
    testeEmail(req: Request, res: Response): void;
}