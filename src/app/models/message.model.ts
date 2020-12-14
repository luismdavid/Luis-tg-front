import { UserModel } from './user.model';

export interface MessageModel {
    sender: UserModel | string;
    type: string;
    sentDate: Date | string;
    content: string;
    attachments?: string[];
}