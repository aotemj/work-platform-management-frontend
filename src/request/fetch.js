import service from './service';
import {getPrefix, getCompanyPrefix} from '../utils/getRouteIds';

export const fetch = (url, params, method, type) => {
    let fetchUrl = '';
    if (type === 'noProject') {
        fetchUrl = getCompanyPrefix() + url;
    } else if (url.indexOf('/api/facade') > -1) {
        fetchUrl = url;
    } else {
        fetchUrl = getPrefix() + url;
    }
    const headers = {
        'Access-Control-Allow-Origin': '*',
    };
    if (method === 'post') {
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
        data: method === 'post' ? params : '',
        response: type === 'blob' ? 'blob' : 'json',
        responseType: type === 'blob' ? 'blob' : 'json',
        transformRequest: [
            function (data) {
                if (method === 'post') {
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

export const postRequest = (url, params, type) => {
    return new Promise((resolve, reject) => {
        fetch(url, params, 'post', type).then(res => {
            resolve(res);
        });
    });
};

export const getRequest = (url, params, type) => {
    return new Promise((resolve, reject) => {
        fetch(url, params, 'get', type).then(res => {
            resolve(res);
        });
    });
};

