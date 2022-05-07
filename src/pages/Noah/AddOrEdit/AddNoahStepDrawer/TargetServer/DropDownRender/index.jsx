import {Radio, Spin} from '@osui/ui';

import cx from '../index.less';
import {AGENT_TERMINAL_TYPE} from '../../../constants';

const DropDownRender = ({type, originNode, handleChangeType, loading}) => {
    return (
        <>
            <div className={cx('dropdown-custom-content')}>
                <Radio.Group
                    options={Object.values(AGENT_TERMINAL_TYPE)}
                    value={type}
                    onChange={handleChangeType}
                    optionType="button"
                />
            </div>
            <Spin spinning={loading}>
                {originNode}
            </Spin>
        </>
    );
};

export default DropDownRender;
