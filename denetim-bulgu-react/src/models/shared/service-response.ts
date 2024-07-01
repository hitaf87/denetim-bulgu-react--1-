import { ServiceResponseBase } from './service-response-base';

export interface ServiceResponse<T> extends ServiceResponseBase {
    result: T;
}
