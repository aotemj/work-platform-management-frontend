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
    // 作业列表
    LIST: '/rest/v1/work-plan/infos',
    // 分类列表
    CATEGORY: '/rest/v1/work-group/list',
    // 单个删除
    INDIVIDUAL_DELETE: '/rest/v1/work-plan/', // '/rest/v1/work-plan/{id}'
    // 批量删除
    DELETE_BY_BATCH: '/rest/v1/work-plan/batch/', // /rest/v1/work-plan/batch/{ids} ids: 逗号分割的id 字符串
    // 批量执行
    EXECUTE_BY_BATCH: '/rest/v1/execute/initialize/batch/', // /rest/v1/execute/initialize/batch/{ids}ids: 逗号分割的id 字符串
};
