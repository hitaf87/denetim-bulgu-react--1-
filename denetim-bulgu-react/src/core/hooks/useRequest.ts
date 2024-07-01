//import { spinnerService } from "@simply007org/react-spinners";
//import { toast } from "react-toastify";
import { useHistory } from 'react-router-dom';

import { httpClient } from '../client';

const useRequest = ({
    url = '',
    method = 'get',
    body = null,
    onSuccess,
    onError = null,
    spinnerId = '',
    showApiErrors = true,
}) => {
    const history = useHistory();
    let innerUrl = url;

    const setUrl = newUrl => {
        innerUrl = newUrl;
    };

    const doRequest = async () => {
        try {
            // if (spinnerId) {
            //     spinnerService.show(spinnerId);
            // }

            const response = await httpClient[method](innerUrl, body);

            const wrappedResponse = {
                ...response,
                isSuccess: response.status.toString().startsWith('2'),
            };
            onSuccess && onSuccess(wrappedResponse);
            return wrappedResponse;
        } catch (err) {
            if (
                err &&
                err.response &&
                err.response &&
                err.response.code === 10025
            ) {
                // "Token validation failed."
                localStorage.removeItem('user');
                history.push('/signin');
                return;
            }

            if (showApiErrors) {
                // if (err && err.response && err.response) {
                //     toast.error(err.response.message, { autoClose: false });
                //     console.log('ERROR OCCURED: ', JSON.stringify(err.response));
                // } else {
                //     toast.error('Something went wrong...', { autoClose: false });
                //     console.log('ERROR OCCURED: ', JSON.stringify(err.response));
                // }
            }
            onError && onError(err.response);
        } finally {
            // if (spinnerId) {
            //     spinnerService.hide(spinnerId);
            // }
        }
    };

    return { doRequest, setUrl };
};

export default useRequest;
