/**
 * 作业步骤最小单元
 * @returns {JSX.Element}
 * @constructor
 */

import {Button} from '@osui/ui';
import {omit} from 'ramda';

import IconFont from '../../../../components/Iconfont';
import cx from './index.less';

const StepItem  = props => {
    const {editing, handleClose} = props;

    return (
        <div className={cx('step-item')}>
            <span className={cx('icon')}>[/] </span>
            <span className={cx('main')}>步骤执行脚本——2022392392349234023498234</span>
            {editing && (
                <Button
                    onClick={() => handleClose(omit('handleClose', props))}
                    type={'text'}
                    icon={<IconFont type={'icondeleteorerror'} />}
                    className={cx('close-button')}
                />
            )}
        </div>
    );
};

export default StepItem;
