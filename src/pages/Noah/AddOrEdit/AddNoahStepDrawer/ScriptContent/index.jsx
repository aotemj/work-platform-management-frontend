import {useCallback, useRef} from 'react';
import {Input, Tabs} from '@osui/ui';
import screenfull from 'screenfull';

import cx from './index.less';
import {SCRIPT_TYPES} from '../../constants';

const {TextArea} = Input;
const {TabPane} = Tabs;

const ScriptContent = props => {
    const {onChange, field, scriptLanguage, setFormValues, values, disabled} = props;
    const containerRef = useRef();
    const toggleFullScreen = useCallback(() => {
        if (screenfull.isEnabled) {
            screenfull.request(containerRef.current);
        }
    }, []);

    return (
        <div className={cx('script-content-container')} ref={containerRef}>
            <Tabs
                defaultActiveKey={scriptLanguage}
                tabBarStyle={{
                    padding: '0 10px',
                }}
                onChange={e => {
                    setFormValues({
                        ...values,
                        scriptLanguage: e,
                    });
                }}
                tabBarExtraContent={(
                    <i
                        className={cx('full-screen-button')}
                        onClick={toggleFullScreen}
                    />
                )}
            >
                {
                    SCRIPT_TYPES.map(({tab, key}) => <TabPane tab={tab} key={key} />)
                }
            </Tabs>
            <TextArea
                className={cx('noah-textarea')}
                autoSize={{minRows: 10}}
                onChange={onChange}
                bordered={false}
                disabled={disabled}
                {...field}
            />
        </div>
    );
};
export default ScriptContent;
