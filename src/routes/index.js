import NoahList from '../pages/Noah/List/index';
import AddOrEditNoah from '../pages/Noah/AddOrEdit/index';
import ExecList from '../pages/Exec/List/index';
import CronList from '../pages/Cron/List/index';
import ExecLog from '../pages/Exec/StepLog';
import DiskSpace from '../pages/DiskSpace/index';

export const routes = {
    NOAH_LIST: {
        path: 'noah/list',
        element: <NoahList />,
    },
    NOAH_ADD: {
        path: 'noah/add',
        element: <AddOrEditNoah />,
    },
    NOAH_EDIT: {
        path: 'noah/:detailId',
        element: <AddOrEditNoah />,
    },
    // 预执行
    NOAH_PRE_EXECUTING: {
        path: 'noah/exec/:detailId',
        element: <AddOrEditNoah />,
    },
    EXEC_LIST: {
        path: 'exec/list',
        element: <ExecList />,
    },
    EXEC_LOG: {
        // detailId: 当前执行详情id, stepId， 详情中单个步骤id
        path: 'exec/step/log/:detailId/:executeId/:stepId',
        element: <ExecLog />,
    },
    CRON_LIST: {
        path: 'cron/list',
        element: <CronList />,
    },
    DISK_SPACE: {
        path: 'disk/space',
        element: <DiskSpace />,
    },
};


