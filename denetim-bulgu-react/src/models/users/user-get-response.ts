export interface UserGetResponse {
    id: string;
    username: string;
    name: string;
    surname: string;
    email: string;
    phoneNumber: number;
    isActive: boolean;
    isLocked: boolean;
}
