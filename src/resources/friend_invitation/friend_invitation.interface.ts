export interface IFriendInvitation {
    enviarConvite(req, res): void;
    aceitarRecusarConvite(req, res): void;
    convitesPendentes(req, res): void;
}