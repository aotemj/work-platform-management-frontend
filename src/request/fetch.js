import service from './service';
import {getPrefix} from '../utils/getRouteIds';

export const fetch = (url, params, method, type, hasFix) => {
    let fetchUrl = '';
    if (hasFix === 'none' || hasFix === 'no') {
        fetchUrl = url;
    } else {
        fetchUrl = getPrefix() + url;
    }
    const headers = {
        'Access-Control-Allow-Origin': '*',
    };
    if (method === 'post' || method === 'put') {
        if (type === 'formData') {
            headers['Content-Type'] = 'application/x-www-form-urlencoded';
        } else {
            headers['Content-Type'] = 'application/json';
        }
    }
    return service({
        method: method,
        headers,
        url: fetchUrl,
        data: method === 'post' || method === 'put' ? params : '',
        response: type === 'blob' ? 'blob' : 'json',
        responseType: type === 'blob' ? 'blob' : 'json',
        transformRequest: [
            function (data) {
                if (method === 'post' || method === 'put') {
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
        params: method === 'get' ? params : '',
    });
};

export const request = ({url, params, method, type, hasFix}) => {
    return new Promise((resolve, reject) => {
        fetch(url, params, method, type, hasFix).then(res => {
            resolve(res, hasFix);
        });
    });
};

