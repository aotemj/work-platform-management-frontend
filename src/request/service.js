import axios from 'axios';
import {message} from '@osui/ui';
import {getCompanyId, getSpaceId} from '../utils/getRouteIds';
import {Toast} from '../utils';

const service = axios.create({
    // timeout: 30000,
});

const companyId = getCompanyId();
const projectId = getSpaceId();

// 判断是企业路由吗？
const groupType = !projectId ? 1 : 2;

service.interceptors.request.use(
    config => {
        config.headers['Group-Name'] = projectId ? projectId : companyId;
        config.headers['Group-Type'] = groupType;
        config.headers.Cookie
            // eslint-disable-next-line max-len
            = 'ai_user=6NyO9vxxTxCVdimsKANvcg|2022-01-10T08:11:56.755Z; USER_REALM_KEY="eyJyZWFsbVV1aWQiOiJvc2MiLCJjbGllbnRJZCI6Im9uZS1zc28ifQ=="; PRE-GW-LOAD=eyJhbGciOiJIUzI1NiJ9.eyJpZCI6IjEiLCJ1U05DcmVhdGVkIjoiMSIsImRpc3BsYXlOYW1lIjoi5LyB5Lia6LSf6LSj5Lq6Iiwic0FNQWNjb3VudE5hbWUiOiJvc2MtYWRtaW4iLCJjb21wYW55Ijoib3NjIiwiY29tcGFueUlkZW50aXR5IjoiQ09NUEFOWV9PV05FUiIsInVzZXJQcmluY2lwYWxOYW1lIjoib3NjLWFkbWluQHFxLmNvbSIsImp0aSI6IjIxMjY4ODZmMjAwZDRjYWE4Mjk5NGFlNTQ5ZTU0Yjc5IiwiaWF0IjoxNjQ5ODMwNjI4LCJzdWIiOiIxIiwiZXhwIjoxNjUwNDAyMDAwfQ.VsXYXvpxFpjuA2yrAt9kWE-FmJBTIDRCmGe23F-0A9g; PRE-GW-SESSION=2126886f200d4caa82994ae549e54b79; JSESSIONID=11vbb4zxfq2ckyw16jh1de5pu';
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
        Toast.error(msg || response.data.msg);
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
            Toast.error(msg);
        }
        return Promise.resolve({
            status: -1,
            data: null,
            msg: msg,
        });
    },
);

export default service;
