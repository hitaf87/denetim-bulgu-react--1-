export interface UserPutRequest {
    email: string;
    phoneNumber: number;
    name: string;
    surname: string;
    isActive: boolean;
    isLocked: boolean;
    AssignedRoles: Array<string>;
    UnassignedRoles: Array<string>;
}
