import { MessageModel } from './message.model';
import { UserModel } from './user.model';

export interface ChatModel {
    _id?: string;
    title: string;
    participants: UserModel[] | string[],
    admins: UserModel[] | string[],
    messages: MessageModel[] | string[],
    type: 'private' | 'group' | 'channel',
    image?: string;
}