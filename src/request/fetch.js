import service from './service';
import {REQUEST_METHODS} from '../constant';

export const fetch = (url, params, method, type) => {
    const {POST, GET, PUT} = REQUEST_METHODS;

    const headers = {
        'Access-Control-Allow-Origin': '*',
    };
    if (method === POST || method === PUT) {
        if (type === 'formData') {
            headers['Content-Type'] = 'application/x-www-form-urlencoded';
        } else {
            headers['Content-Type'] = 'application/json';
        }
    }
    return service({
        method: method,
        headers,
        url,
        data: method === POST || method === PUT ? params : '',
        response: type === 'blob' ? 'blob' : 'json',
        responseType: type === 'blob' ? 'blob' : 'json',
        transformRequest: [
            function (data) {
                if (method === POST || method === PUT) {
                    if (type === 'formData') {
                        return data;
                    }
                    return JSON.stringify(data);
                }
                let ret = '';
                // eslint-disable-next-line
                for (let it in data) {
                    ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&';
                }
                return ret;
            },
        ],
        params: method === GET ? params : '',
    });
};

export const request = ({url, params, method = REQUEST_METHODS.GET, type}) => {
    return new Promise((resolve, reject) => {
        fetch(url, params, method, type).then(res => {
            resolve(res);
        });
    });
};

