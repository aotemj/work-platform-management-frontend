/**
 * 作业步骤最小单元
 * @returns {JSX.Element}
 * @constructor
 */

import {useCallback, useState} from 'react';
import {Button} from '@osui/ui';

import IconFont from '../../../../components/Iconfont';
import cx from './index.less';

const StepItem  = props => {
    const {name, editing, handleClose, handleEdit} = props;
    const [focus, setFocus] = useState(false);

    const handleFocus = useCallback(() => {
        setFocus(true);
    }, []);

    const handleBlur = useCallback(() => {
        setFocus(false);
    }, []);

    return (
        <div
            className={cx('step-item')}
            onMouseEnter={handleFocus}
            onMouseLeave={handleBlur}
            onClick={handleEdit}
        >
            <span className={cx('icon')}>[/] </span>
            <span className={cx('main')}>{name}</span>
            {editing && (
                <Button
                    onClick={handleClose}
                    type={'text'}
                    icon={<IconFont type={'icondeleteorerror'} />}
                    className={cx('close-button')}
                />
            )}
            {focus && (
                <i
                    className={cx('editing-button')}
                    onClick={handleEdit}
                />
            )}
        </div>
    );
};

export default StepItem;
