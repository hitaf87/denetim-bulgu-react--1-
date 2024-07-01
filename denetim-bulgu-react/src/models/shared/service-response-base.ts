import { ErrorInfo } from './error-info';

export interface ServiceResponseBase {
    isSuccessful: boolean;
    error?: ErrorInfo;
}
