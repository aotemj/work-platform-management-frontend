import axios from 'axios';
import {message} from '@osui/ui';
import {getCompanyId, getSpaceId} from '../utils/getRouteIds';

const service = axios.create({
    timeout: 30000,
});
service.interceptors.request.use(
    config => {
        // config.headers['Content-Type'] = 'application/json';
        return config;
    },
    error => {
        return Promise.reject(error);
    },
);

service.interceptors.response.use(
    response => {
        if (response.config.response === 'blob') {
            return Promise.resolve({
                data: response.data,
            });
        }
        let {status, statusCode, msg, ...other} = response.data;
        if (status === 0 || statusCode === 200 || status === 'OK' || status === undefined) {
            return Promise.resolve({
                ...other,
                status: 0,
                msg: msg || response.data.msg,
            });
        }
        message.error(msg || response.data.msg);
        return Promise.resolve({
            ...other,
            status: -1,
            msg: msg || message,
        });
    },
    error => {
        const {status, data} = error.response;
        let msg = '';
        const localtions = window.location;
        switch (status) {
            case 400:
                msg = data.msg || '错误的请求，请检查确认';
                break;
            case 401:
                window.location.href = `${localtions.origin}/login?redirect=${encodeURIComponent(localtions.href)}`;
                break;
            case 402:
                window.location.href = `${localtions.origin}/login?user_status=FORBIDDENED}`;
                break;
            case 403:
                window.location.href = `${localtions.origin}/${getCompanyId()}/${getSpaceId()}/403`;
                break;
            case 404:
                msg = data.msg || '资源为空';
                break;
            case 500:
                msg = data.msg || '服务异常，请刷新重试或联系管理员';
                break;
            case 502:
                msg = data.msg || '网关异常，请联系管理员';
                break;
            case 503:
                msg = data.msg || '服务不可用，请联系管理员';
                break;
            case 504:
                msg = data.msg || '网关请求超时，请刷新重试或联系管理员';
                break;
            default:
                msg = data.msg || '服务器错误';
                break;
        }
        if (msg) {
            message.error(msg);
        }
        return Promise.resolve({
            status: -1,
            data: null,
            msg: msg,
        });
    },
);

export default service;
