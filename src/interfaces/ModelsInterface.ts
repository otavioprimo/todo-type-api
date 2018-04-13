import { FriendsInvitationModel } from './../models/FriendsInvitation';
import { FriendsListModel } from './../models/FriendsListModel';
import { UserModel } from './../models/UserModel';

export interface ModelsInterface {
    User: UserModel;
    FriendList: FriendsListModel;
    FriendsInvitation:FriendsInvitationModel;
}