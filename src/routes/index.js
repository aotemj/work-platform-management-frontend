import {BrowserRouter, Route, Routes} from 'react-router-dom';
import zhCN from 'antd/lib/locale/zh_CN';
import {ConfigProvider} from '@osui/ui';
import '../index.global.less';

const App = () => (
    <ConfigProvider
        getPopupContainer={() => {
            const node = document.getElementById('osc-noah');
            if (node) {
                return node;
            }
            return document.body;
        }}
        locale={zhCN}
    >
        <div
            data-theme="osui"
            id="osc-noah"
            className="osc-noah"
            style={{height: '100%', maxHeight: '100vh', overflow: 'auto'}}
        >
            <BrowserRouter>
                <Routes>
                    {/*<Route path="/:company/:project/cov/module/list" element={<ModuleList />} />*/}
                    {/*<Route path="/:company/:project/cov/module/edit" element={<ModuleEdit />} />*/}
                    {/*<Route path="/:company/:project/cov/task/list" element={<TaskList />} />*/}
                    {/*<Route path="/:company/:project/cov/detail" element={<CovDetail />} />*/}
                </Routes>
            </BrowserRouter>
        </div>
    </ConfigProvider>
);
export default App;
