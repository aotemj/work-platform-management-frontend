import {useCallback, useRef} from 'react';
import {Input, Tabs} from '@osui/ui';
import screenfull from 'screenfull';

import cx from './index.less';
import {SCRIPT_TYPES} from '../../constants';

const {TextArea} = Input;
const {TabPane} = Tabs;

const ScriptContent = props => {
    const {onChange, field} = props;
    const containerRef = useRef();
    const toggleFullScreen = useCallback(() => {
        if (screenfull.isEnabled) {
            screenfull.request(containerRef.current);
        }
    }, []);

    // const handleChange = useCallback(() => {
    //
    // }, []);

    return (
        <div className={cx('script-content-container')} ref={containerRef}>
            <Tabs
                defaultActiveKey={SCRIPT_TYPES[0].key}
                tabBarStyle={{
                    padding: '0 10px',
                }}
                onChange={() => {}}
                tabBarExtraContent={(
                    <i
                        className={cx('full-screen-button')}
                        onClick={toggleFullScreen}
                    />
                )}
            >
                {
                    SCRIPT_TYPES.map(item => {
                        const {tab, key} = item;
                        return <TabPane tab={tab} key={key} />;
                    })
                }
            </Tabs>
            <TextArea
                className={cx('noah-textarea')}
                autoSize={{minRows: 10}}
                onChange={onChange}
                bordered={false}
                {...field}
            />
        </div>
    );
};
export default ScriptContent;
