import { MessageModel } from './message.model';
import { UserModel } from './user.model';

export interface ChatModel {
    _id?: string;
    title: string;
    participants: UserModel[] | string[],
    messages: MessageModel[],
    isPrivate: boolean,
    image?: string;
}