import { UserModel } from './user.model';

export interface MessageModel {
    _id?: string;
    sender: UserModel | string;
    type: string;
    sentDate: Date | string;
    content: string;
    attachments?: string[];
}