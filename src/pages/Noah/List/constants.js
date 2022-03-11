export const DROP_DOWN_MENU = {
    EXECUTING: {
        label: '批量执行',
        key: 'EXECUTING',
    },
    REMOVE: {
        label: '批量删除',
        key: 'REMOVE',
    },
};

export const URLS = {
    LIST: 'rest/v1/work-plan/infos',
    CATEGORY: '/rest/v1/work-group/list',
    INDIVIDUAL_DELETE: '/rest/v1/work-plan/', // '/rest/v1/work-plan/{id}'
    DELETE_BY_BATCH: '/rest/v1/work-plan/batch/', // /rest/v1/work-plan/batch/{ids} ids: 逗号分割的id 字符串
};
