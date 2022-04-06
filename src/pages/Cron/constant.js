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

export const URLS = {
    // 分页查询定时任务
    CRON_LIST_URL: '/rest/v1/cron-execute',
    ADD_CRON: '/rest/v1/cron-execute',
    DELETE_CRON_ITEM: '/rest/v1/cron-execute/', // /rest/v1/cron-execute/{id}
    GET_CRON_DETAIL: '/rest/v1/cron-execute/', // rest/v1/cron-execute/{id}
    EDIT_CRON: '/rest/v1/cron-execute/', // rest/v1/cron-execute/{id}
    getToggleCronStatusUrl: id => `/rest/v1/cron-execute/${id}/open-status`,
    // /rest/v1/cron-execute/cron-execute-trigger/{cronExecuteId}
    CRON_RECORD: '/rest/v1/cron-execute/cron-execute-trigger/',
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
