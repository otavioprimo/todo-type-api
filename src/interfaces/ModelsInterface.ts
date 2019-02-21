import { TaskCheckListModel } from './../models/TaskCheckListModel';
import { TokenResetPasswordModel } from './../models/TokenResetPasswordModel';
import { ConfirmEmailModel } from './../models/ConfirmEmailModel';
import { FriendsInvitationModel } from './../models/FriendsInvitationModel';
import { FriendsListModel } from './../models/FriendsListModel';
import { UserModel } from './../models/UserModel';
import { TaskModel } from '../models/TasksModel';

export interface ModelsInterface {
    ConfirmEmail: ConfirmEmailModel;
    FriendsList: FriendsListModel;
    FriendsInvitation: FriendsInvitationModel;
    Task: TaskModel;
    TokenResetPassword: TokenResetPasswordModel;
    User: UserModel;
    TaskCheckList: TaskCheckListModel;
}