export interface TwoFactorVerificationModel {
    verificationType: string;
    userName: string;
    verificationCode: string;
}
export class TwoFactorVerificationClass {
    verificationType: string;
    userName: string;
    verificationCode: string;
    constructor(verificationType, userName, verificationCode) {
        this.verificationType = verificationType;
        this.userName = userName;
        this.verificationCode = verificationCode;
    }
}