import {BrowserRouter, Route, Routes} from 'react-router-dom';
import zhCN from 'antd/lib/locale/zh_CN';
import {ConfigProvider, message} from '@osui/ui';
import {useEffect} from 'react';
import {Provider} from 'react-redux';

import '../index.global.less';
import {CONTAINER_DOM_ID, PROJECT_ROUTE} from '../constant';
import {getContainerDOM, getUrlPrefixReal} from '../utils';
import store from '../store';
import NoahList from '../pages/Noah/List/index';
import AddOrEdit from '../pages/Noah/AddOrEdit';
import ExecList from '../pages/Exec/List';
import CronList from '../pages/Cron/List';
import ExecLog from '../pages/Exec/Log';

/**
 * 创建通用路由
 * @param url 路由路径
 * @param addProjectId
 * @param component 对应组件
 * @returns {JSX.Element}
 */

const getRoute = ({url, addProjectId = false, component}) => {
    const URL_PREFIX_TEMP = addProjectId ? `/:companyId/:projectId/${PROJECT_ROUTE}` : `/:companyId/${PROJECT_ROUTE}`;

    return <Route key={url} path={`${URL_PREFIX_TEMP}/${url}`} element={component} />;
};

export const routes = {
    NOAH_LIST: {
        url: 'noah/list',
        component: <NoahList />,
    },
    NOAH_ADD: {
        url: 'noah/add',
        component: <AddOrEdit />,
    },
    NOAH_EDIT: {
        url: 'noah/:detailId',
        getUrl: id => `${getUrlPrefixReal()}/${routes.NOAH_EDIT.url.replace(':detailId', id)}`,
        component: <AddOrEdit />,
    },
    // 预执行
    NOAH_PRE_EXECUTING: {
        url: 'noah/exec/:detailId',
        getUrl: id => `${getUrlPrefixReal()}/${routes.NOAH_PRE_EXECUTING.url.replace(':detailId', id)}`,
        component: <AddOrEdit />,
    },
    EXEC_LIST: {
        url: 'exec/list',
        component: <ExecList />,
    },
    EXEC_LOG: {
        url: 'exec/log/:detailId',
        getUrl: id => `${getUrlPrefixReal()}/${routes.EXEC_LOG.url.replace(':detailId', id)}`,
        component: <ExecLog />,
    },
    CRON_LIST: {
        url: 'cron/list',
        component: <CronList />,
    },
};

const App = () => {
    useEffect(() => {
        message.config({
            getContainer: getContainerDOM,
        });
        return () => {
            message.destroy();
        };
    }, []);
    return (
        <Provider store={store}>
            <ConfigProvider
                getPopupContainer={() => {
                    const node = getContainerDOM();
                    if (node) {
                        return node;
                    }
                    return document.body;
                }}
                locale={zhCN}
            >
                <div
                    data-theme="osui"
                    id={CONTAINER_DOM_ID}
                    className="osc-noah"
                    style={{height: '100%', maxHeight: '100vh', overflow: 'auto'}}
                >
                    <BrowserRouter>
                        <Routes>
                            {
                                Object.values(routes).map(item => {
                                    const {url, component} = item;
                                    return getRoute({url, component});
                                })
                            }
                            {
                                Object.values(routes).map(item => {
                                    const {url, component} = item;
                                    return getRoute({url, component, addProjectId: true});
                                })
                            }
                            <Route path="/" element={<NoahList />} />
                        </Routes>
                    </BrowserRouter>
                </div>
            </ConfigProvider>
        </Provider>
    );
};
export default App;
