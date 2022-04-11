import {ReactComponent as ReadyRun} from '../../../statics/icons/readyrun.svg';// 未开始
import {ReactComponent as CloseCircle} from '../../../statics/icons/closecircle.svg';// 执行失败
import {ReactComponent as CheckCircle} from '../../../statics/icons/checkcircle.svg';// 初始化、执行成功
import {ReactComponent as Suspend} from '../../../statics/icons/suspend.svg';// 执行暂停
import {ReactComponent as Warning} from '../../../statics/icons/warning-Circle-Fill.svg';
import Iconfont from '../../../components/Iconfont';
import cx from './index.less';

export const URLS = {
    // 获取分类
    CATEGORIES: '/rest/v1/work-group/list',
    // 作业列表
    LIST: '/rest/v1/work-plan/infos',
    GET_NOAH_WORK_PLAN_DETAIL: '/rest/v1/work-plan/',
    GET_EXECUTION_DETAIL: '/rest/v1/execute/', // 执行详情 // /rest/v1/execute/{id}
    RE_EXECUTE: '/rest/v1/execute/retry/work-trigger/', // '/rest/v1/execute/retry/work-trigger/{id}' // 重新执行详情
    NEGLECT_ERRORS: '/rest/v1/execute/error/ignore/', // 忽略错误 // /rest/v1/execute/error/ignore/{id}
    // 全部重新执行  // /rest/v1/execute/retry/stage-trigger/{id}
    ENTIRELY_RE_EXECUTE: '/rest/v1/execute/retry/stage-trigger/',
    // 作业步骤人工确认结果
    CONFIRM_MANUAL_RESULT: '/rest/v1/execute/stage-confirm',
    // 分页获取执行列表
    EXEC_LIST_URL: '/rest/v1/execute/infos',
    DISK_SPACE_INFO: '/rest/v1/file',
    CHECK_DISK_SPACE: '/rest/v1/file/checkDisk',
};

// 执行状态 1：待执行；2：执行中；3：执行失败；4：执行成功；5：执行暂停；
export const READY_RUN = {
    label: '待执行',
    icon: <ReadyRun />,
    value: 1,
};
export const RUNNING = {
    label: '执行中',
    icon: <Iconfont type={'iconrunning'} className={cx('running-icon')} />,
    value: 2,
};
export const FAILED = {
    label: '执行失败',
    icon: <CloseCircle />,
    value: 3,
};
export const SUCCESS = {
    label: '执行成功',
    icon: <CheckCircle />,
    value: 4,
};
export const PAUSE = {
    label: '执行暂停',
    icon: <Suspend />,
    value: 5,
};
export const IGNORE_ERROR = {
    label: '忽略错误',
    icon: <Warning />,
    value: 3,
    styleLabel: 6,
};

export const PASS = {
    label: '确认通过',
    icon: <CheckCircle />,
    value: 4,
};
export const NOT_PASS = {
    label: '不通过',
    icon: <CloseCircle />,
    value: 3,
};

export const RUN_STATUSES = new Map([
    [READY_RUN.value, READY_RUN],
    [SUCCESS.value, SUCCESS],
    [RUNNING.value, RUNNING],
    [FAILED.value, FAILED],
    [PAUSE.value, PAUSE],
]);

export const CONFIRM_RESULTS = {
    PASS: 1,
    NO_PASS: 2,
};
