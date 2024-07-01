import { ClaimResponse } from '../claim-helper/claim-response';

export interface LoginResponse {
    token: string;
    refreshToken: string;
    claims: Array<ClaimResponse>;
    userId: string;
    username: string;
}
