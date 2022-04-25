import NoahList from '../pages/Noah/List/NoahList';
import AddOrEditNoah from '../pages/Noah/AddOrEdit/AddOrEditNoah';
import ExecList from '../pages/Exec/List/ExecList';
import Index from '../pages/Cron/List';
import ExecLog from '../pages/Exec/StepLog/StepLog';
import DiskSpace from '../pages/DiskSpace/DiskSpace';

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
        element: <Index />,
    },
    DISK_SPACE: {
        path: 'disk/space',
        element: <DiskSpace />,
    },
};


