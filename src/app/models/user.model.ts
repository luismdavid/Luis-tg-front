export interface UserModel {
    _id?: string;
    email: string;
    password: string;
    name: string;
    phoneNumber: string;
    profileImg?: string;
    verificationCode?: string;
}