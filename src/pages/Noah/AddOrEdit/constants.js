// 全局变量类型
export const GLOBAL_VARIABLE_TYPES = {
    STRING: {
        label: '字符串',
        value: 'STRING',
    },
    SECRET_KEY: {
        label: '秘钥',
        value: 'SECRET_KEY',
    },
};

// 作业步骤类型
export const STEP_TYPES = {
    EXECUTE_SCRIPT: {
        label: '执行脚本',
        value: 'EXECUTE_SCRIPT',
    },
    FILE_DISTRIBUTION: {
        label: '文件分发',
        value: 'FILE_DISTRIBUTION',
    },
    MANUAL_CONFIRM: {
        label: '人工确认',
        value: 'MANUAL_CONFIRM',
    },
};

// 运行环境
export const RUNNING_ENVIRONMENT = {
    AGENT: {
        label: '主机运行',
        value: 'AGENT',
    },
    CONTAINER: {
        label: '容器运行',
        value: 'CONTAINER',
    },
};

// 脚本来源
export const SCRIPTS_ORIGIN = {
    MANUAL_INPUT: {
        label: '手动录入',
        value: 'MANUAL_INPUT',
    },
    IMPORT_SCRIPTS: {
        label: '脚本引入',
        value: 'IMPORT_SCRIPTS',
    },
};

// 脚本语言类型
export const SCRIPT_TYPES = [
    {
        tab: 'Linux Bash',
        key: 'Linux_Bash',
    },
    {
        tab: 'Groovy',
        key: 'Groovy',
    },
    {
        tab: 'Python',
        key: 'Python',
    },
];

// 主机类型
export const LABEL_TYPE = {
    '1': '部署',
    '2': '执行',
    '3': ['部署', '执行'],
};

// 主机状态
export const AGENT_STATUS = {
    ONLINE: 'ONLINE',
};

// 主机终端类型
export const AGENT_TERMINAL_TYPE = {
    LINUX: {
        label: 'Linux',
        value: 2,
    },
    WINDOWS: {
        label: 'Windows',
        value: 1,
    },
};

export const URL_PREFIX1 = '/api';

export const URL = {
    LABELS: '/sa_server/sa/rest/v3/labels',
    AGENTS: '/sa_server/sa/rest/v1/agents',
    ADD_NOAH_WORK_PLAN: '/rest/v1/work-plan',
    // 新增分类
    ADD_CATEGORIES: '/rest/v1/work-group',
    CATEGORIES: '/rest/v1/work-group/list',
};

// 主机类型
export const GROUP_TYPES = {
    ENTERPRISE: 1,
    PROJECT: 2,
    ALL: 3,
};
