// 全部主机重试
import urlJoin from 'url-join';

import {request} from '../../../../request/fetch';
import {REQUEST_METHODS, COMMON_URL_PREFIX, MILLI_SECOND_STEP} from '../../../../constant';
import {URLS} from '../constant';
import {requestCallback} from '../../../../utils';

const goBackToExecList = navigate => {
    let timer = setTimeout(() => {
        navigate(-1);
        clearTimeout(timer);
    }, MILLI_SECOND_STEP);
};
// 全部主机 重试
export const entirelyRetry = async ({id}, navigate) => {
    const res = await request({
        url: urlJoin(COMMON_URL_PREFIX, URLS.ENTIRELY_RE_EXECUTE, String(id)),
        method: REQUEST_METHODS.POST,
    });
    requestCallback({res, callback() {
        goBackToExecList(navigate);
    }});
};

// 忽略错误 注意： 当前参数id为 当前步骤id
export const neglectErrors = async ({id}, navigate) => {
    const res = await request({
        url: urlJoin(COMMON_URL_PREFIX, URLS.NEGLECT_ERRORS, String(id)),
        method: REQUEST_METHODS.POST,
    });
    requestCallback({
        res,
        callback() {
            goBackToExecList(navigate);
        },
    });
};

