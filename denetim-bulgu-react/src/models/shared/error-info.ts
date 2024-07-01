import { ValidationErrorInfo } from './validation-error-info';

export interface ErrorInfo {
    correlationId: string;
    code: number;
    message: string;
    details: string;
    items?: Array<ValidationErrorInfo>;
}
