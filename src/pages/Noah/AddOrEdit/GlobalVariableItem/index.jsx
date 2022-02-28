/**
 * 全局变量最小单元
 */

import {Button} from '@osui/ui';
import {omit} from 'ramda';

import IconFont from '../../../../components/Iconfont';
import cx from './index.less';
import VariableIcon from './VariableIcon';
import {GLOBAL_VARIABLE_TYPES} from '../constants';

const GlobalVariableItem = props => {
    const {title, type, value, editing, handleClose} = props;
    const finalValue = type === GLOBAL_VARIABLE_TYPES.STRING.value
        ? value
        : '********';
    return (
        <div className={cx('global-variable-container')}>
            <div className={cx('icon')}>
                <VariableIcon type={type} />
            </div>
            <div className={cx('right')}>
                <div className={cx('title')}>{title}</div>
                <div className={cx('sub-title')}>{finalValue}</div>
            </div>
            {editing && <Button
                onClick={() => handleClose(omit('handleClose', props))}
                type={'text'}
                icon={<IconFont type={'icondeleteorerror'} />}
                className={cx('close-button')}
            />}
        </div>
    );
};

export default GlobalVariableItem;

