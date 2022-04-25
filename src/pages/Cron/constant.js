import urlJoin from 'url-join';
import {parseTemplate} from 'url-template';
// 执行策略
export const STRATEGIES = {
    // 单次执行
    SINGLE: {
        label: '单次执行',
        value: 1,
        format: 'YYYY-MM-DD HH:mm',
    },
    // 周期执行
    LOOP: {
        // disabled: true,
        label: '周期执行',
        value: 2,
    },
};

export const STRATEGIES_TYPES = new Map([
    [STRATEGIES.SINGLE.value, STRATEGIES.SINGLE],
    [STRATEGIES.LOOP.value, STRATEGIES.LOOP],
]);

const COMMON_EXEC_URL_PREFIX = '/rest/v1/cron-execute';
export const URLS = {
    // 分页查询定时任务
    CRON_LIST_URL: COMMON_EXEC_URL_PREFIX,
    ADD_CRON: COMMON_EXEC_URL_PREFIX,
    DELETE_CRON_ITEM: parseTemplate(urlJoin(COMMON_EXEC_URL_PREFIX, '{id}')), // /rest/v1/cron-execute/{id}
    GET_CRON_DETAIL: parseTemplate(urlJoin(COMMON_EXEC_URL_PREFIX, '{detailId}')), // rest/v1/cron-execute/{id}
    EDIT_CRON: parseTemplate(urlJoin(COMMON_EXEC_URL_PREFIX, '{cronId}')), // rest/v1/cron-execute/{id}
    TOGGLE_CRON_STATUS_TEMPLATE: parseTemplate(urlJoin(COMMON_EXEC_URL_PREFIX, '{id}', 'open-status')),
    CRON_RECORD: parseTemplate(urlJoin(COMMON_EXEC_URL_PREFIX, 'cron-execute-trigger', '{recordId}')),
};

export const CRON_DATE_WEEKS = [
    {
        label: '星期一',
        value: 1,
    },
    {
        label: '星期二',
        value: 2,
    },
    {
        label: '星期三',
        value: 3,
    },
    {
        label: '星期四',
        value: 4,
    },
    {
        label: '星期五',
        value: 5,
    },
    {
        label: '星期六',
        value: 6,
    },
    {
        label: '星期日',
        value: 7,
    },
];
