import {BrowserRouter, Route, Routes} from 'react-router-dom';
import zhCN from 'antd/lib/locale/zh_CN';
import '../index.global.less';
import {ConfigProvider, message} from '@osui/ui';
import {CONTAINER_DOM_ID, ROUTE_PREFIX} from '../constant';

import NoahList from '../pages/Noah/List';
import {useEffect} from 'react';
import AddOrEdit from '../pages/Noah/AddOrEdit';
import {getContainerDOM} from '../utils';

/**
 * 创建通用路由
 * @param url 路由路径
 * @param component 对应组件
 * @returns {JSX.Element}
 */
const getRoute = (url, component) => {
    return <Route key={url} path={`${ROUTE_PREFIX}/${url}`} element={component} />;
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
        getUrl: id => `${ROUTE_PREFIX}/${routes.NOAH_EDIT.url.replace(':detailId', id)}`,
        component: <AddOrEdit />,
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
                                return getRoute(item.url, item.component);
                            })
                        }
                    </Routes>
                </BrowserRouter>
            </div>
        </ConfigProvider>
    );
};
export default App;
