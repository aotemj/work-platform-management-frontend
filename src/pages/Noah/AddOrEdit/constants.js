import {parseTemplate} from 'url-template';
import urlJoin from 'url-join';
import {STEP_TYPES, UPLOAD_URL_PREFIX} from '../../../constant';

// 全局变量类型
export const GLOBAL_VARIABLE_TYPES = {
    STRING: {
        label: '字符串',
        value: 1,
    },
    SECRET_KEY: {
        label: '秘钥',
        value: 2,
    },
};

// 运行环境              // runtimeEnv	运行环境 1：主机运行，2：容器运行		false   // integer
export const RUNNING_ENVIRONMENT = {
    AGENT: {
        label: '主机运行',
        value: 1,
    },
    // 一期暂时不做
    CONTAINER: {
        disabled: true,
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

export const URLS = {
    ADD_NOAH_WORK_PLAN: '/rest/v1/work-plan/',
    // 新增分类
    ADD_CATEGORIES: '/rest/v1/work-group',
    // 获取全局参数
    GLOBAL_VARIABLES: '/rest/v1/work-variate/type',
    // 上传本地文件
    UPLOAD_LOCAL_FILE: '/rest/v1/file/local',
    // NOAH_DETAIL: id => `/rest/v1/work-plan`,
    // 切换启停
    TOGGLE_EXECUTION: '/rest/v1/work-stage/open-status',
    // 作业单个执行 // /rest/v1/execute/initialize/{id}
    INDIVIDUAL_EXECUTE: parseTemplate(urlJoin('/rest/v1/execute/initialize/', '{id}')),
    // 分片上传 检查
    UPLOAD_LOCAL_BY_SEPARATING_CHECK: urlJoin(UPLOAD_URL_PREFIX, 'check'),
    // 分片上传
    UPLOAD_LOCAL_BY_SEPARATING: UPLOAD_URL_PREFIX,
    // 分片上传完成
    UPLOAD_LOCAL_BY_SEPARATING_FINISHED: urlJoin(UPLOAD_URL_PREFIX, 'finish'),
};

// 主机类型
export const GROUP_TYPES = {
    ENTERPRISE: 1,
    PROJECT: 2,
    ALL: 3,
};

export const ERROR_MSG = {
    VARIABLE_ALREADY_EXIST: '当前全局变量已存在',
    CATEGORY_ALREADY_EXIST: '当前分类已存在',
};

// 文件来源类型
export const FILE_SOURCE_TYPE = {
    LOCAL: 1,
    SERVER: 2,
};

// 上传文件状态
export const SUCCESS = {
    label: 'SUCCESS',
    value: 0,
};
export const ERROR = {
    label: 'error',
    value: 1,
};
export const LOADING = {
    label: 'LOADING',
    value: 2,
};
export const DELETED = {
    label: 'DELETED',
    value: -1,
};

export const UPDATE_FILE_STATUS = new Map([
    [SUCCESS.value, SUCCESS], [SUCCESS.label, SUCCESS],
    [ERROR.value, ERROR], [ERROR.label, ERROR],
    [LOADING.value, LOADING], [LOADING.label, LOADING],
    [DELETED.value, DELETED], [DELETED.label, DELETED],
]);


// 传输模式
export const TRANSMISSION_MODE = {
    // 强制模式
    FORCE: {
        key: '强制模式',
        value: 1,
    },
    // 严谨模式
    STRICT: {
        key: '严谨模式',
        value: 2,
    },
};

// 人工确认，通知方法
export const NOTICE_APPROACHES = {
    // 通知方式 1：邮件；2：短信；3：微信；4：站内通知
    EMAIL: {
        label: '邮件',
        value: 1,
        visible: true,
    },
    MESSAGE: {
        label: '短信',
        value: 2,
        visible: false,
        // visible: true,
    },
    WECHAT: {
        label: '微信',
        value: 3,
        visible: false,
    },
    STAND_INSIDE_LETTER: {
        label: '站内信',
        value: 4,
        visible: false,
    },
};

// exeChange	是否赋值可变 0：否；1：是		false   // integer
// exeRequired	是否执行时必填 0：否；1：是		false   // integer
export const BOOLEAN_FROM_SERVER = {
    POSITIVE: 1,
    NEGATIVE: 0,
};

// openStatus	开关状态 0：关；1：开	query	true    integer(int32)

export const EXECUTING_STATUS = {
    OPEN: 1,
    CLOSE: 0,
};

export const defaultFormikValues = {
    type: STEP_TYPES.EXECUTE_SCRIPT.value,
    name: '',
    // about execute script
    runningEnvironment: RUNNING_ENVIRONMENT.AGENT.value,
    scriptOrigin: SCRIPTS_ORIGIN.MANUAL_INPUT.value,
    chooseScript: null, // number 类型
    scriptContents: '',
    targetResourceList: [],
    scriptLanguage: SCRIPT_TYPES[0].key,
    scriptParams: '',
    // 18. 脚本执行/文件分发，默认超时时间60秒
    timeoutValueForExecuteScript: 60,
    timeoutValueForFileDistribution: 60,
    timeoutValueForManualConfirm: 3,
    // about file distribution
    // 文件
    uploadLimitDisabled: true,
    // 后端单位kb, 接口提交需要前端转换
    uploadLimit: 0,
    downloadLimitDisabled: true,
    downloadLimit: 0,
    storageFileList: [],
    transmissionMode: 1,
    targetPath: '',

    // 人工确认 相关
    // 通知方式
    informWay: [NOTICE_APPROACHES.EMAIL.value],
    // 通知描述
    describes: '',
    // 通知人员
    informUserId: [],
};

export const LOADING_STATUS = {
    STARTING: 'STARTING',
    UPLOADING: 'UPLOADING',
    SUCCESS: 'SUCCESS',
    CHECKING: 'CHECKING',
    ERROR: 'ERROR',
};
