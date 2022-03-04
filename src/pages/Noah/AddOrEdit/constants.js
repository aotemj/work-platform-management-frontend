// 全局变量类型
export const GLOBAL_VARIABLE_TYPES = {
    STRING: {
        label: '字符串',
        value: '1',
    },
    SECRET_KEY: {
        label: '秘钥',
        value: '2',
    },
};

// 作业步骤类型
export const STEP_TYPES = {
    EXECUTE_SCRIPT: {
        label: '执行脚本',
        value: 1,
    },
    FILE_DISTRIBUTION: {
        label: '文件分发',
        value: 2,
    },
    MANUAL_CONFIRM: {
        label: '人工确认',
        value: 3,
    },
};

// 运行环境              // runtimeEnv	运行环境 1：主机运行，2：容器运行		false   // integer
export const RUNNING_ENVIRONMENT = {
    AGENT: {
        label: '主机运行',
        value: 1,
    },
    CONTAINER: {
        label: '容器运行',
        value: 2,
    },
};

// 脚本来源 脚本类型 1：脚本引用；2：手动录入
export const SCRIPTS_ORIGIN = {
    MANUAL_INPUT: {
        label: '手动录入',
        value: 2,
    },
    IMPORT_SCRIPTS: {
        label: '脚本引入',
        value: 1,
    },
};

// 脚本语言类型
export const SCRIPT_TYPES = [
    {
        tab: 'Linux Bash',
        key: 'Linux Bash',
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
    ADD_NOAH_WORK_PLAN: '/rest/v1/work-plan/',
    // 新增分类
    ADD_CATEGORIES: '/rest/v1/work-group',
    // 获取分类
    CATEGORIES: '/rest/v1/work-group/list',
    // 获取全局参数
    GLOBAL_VARIABLES: '/rest/v1/work-variate/type',
};

// 主机类型
export const GROUP_TYPES = {
    ENTERPRISE: 1,
    PROJECT: 2,
    ALL: 3,
};

export const ERROR_MSG = {
    VARIABLE_ALREADY_EXIST: '当前全局变量已存在',
};
