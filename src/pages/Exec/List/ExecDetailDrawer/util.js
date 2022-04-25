// 全部主机重试

import {request} from '../../../../request/fetch';
import {REQUEST_METHODS, MILLI_SECOND_STEP} from '../../../../constant';
import {URLS} from '../constant';
import {assembleRequestUrl, requestCallback} from '../../../../utils';

const goBackToExecList = navigate => {
    let timer = setTimeout(() => {
        navigate(-1);
        clearTimeout(timer);
    }, MILLI_SECOND_STEP);
};
// 全部主机 重试
export const entirelyRetry = async ({id}, navigate) => {
    const res = await request({
        url: assembleRequestUrl(URLS.ENTIRELY_RE_EXECUTE.expand({id})),
        method: REQUEST_METHODS.POST,
    });
    requestCallback({res, callback() {
        goBackToExecList(navigate);
    }});
};

// 忽略错误 注意： 当前参数id为 当前步骤id
export const neglectErrors = async ({id}, navigate) => {
    const res = await request({
        url: assembleRequestUrl(URLS.NEGLECT_ERRORS.expand({id})),
        method: REQUEST_METHODS.POST,
    });
    requestCallback({
        res,
        callback() {
            goBackToExecList(navigate);
        },
    });
};

