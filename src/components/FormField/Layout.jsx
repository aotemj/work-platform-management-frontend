// eslint-disable-next-line
import React, {useMemo} from 'react';
import {Tooltip} from '@osui/ui';
import {ReactComponent as IconError} from './icons/error.svg';
import {ReactComponent as IconInfo} from '../../statics/icons/info.svg';
import {ReactComponent as IconSuccess} from './icons/success.svg';
import {ReactComponent as IconWarning} from './icons/warning.svg';
import {ReactComponent as IconRemark} from '../../statics/icons/remark.svg';

import cx from './index.less';

const LevelIconMap = {
    success: <IconSuccess className={cx('error-message-icon')} />,
    error: <IconError className={cx('error-message-icon')} />,
    info: <IconInfo className={cx('error-message-icon')} />,
    warning: <IconWarning className={cx('error-message-icon')} />,
};

const Layout = ({
    id,
    layout = 'vertical', // vertical|horizontal
    label,
    className,
    tooltip = null,
    required = false,
    children = null,
    errors = [],
    hints = [],
    style,
    ...rest
}) => {
    const hasError = useMemo(
        () => Array.isArray(errors) && errors.some(e => (e && 'text' in e)),
        [errors],
    );

    const printableErrors = useMemo(
        () => {
            if (Array.isArray(errors)) {
                return errors.filter(e => (e && e.text));
            }
            return [];
        },
        [errors],
    );

    return (
        <div className={cx('root', layout, {'no-label': label === undefined}, className)} style={style}>
            {label !== undefined && (
                <label htmlFor={id} className={cx('label')}>
                    {required && layout === 'vertical' && (
                        <span className={cx({required})}>*</span>
                    )}
                    <span className={cx('text')}>
                        {label}
                    </span>
                    {
                        layout === 'vertical' && (
                            <span className={cx('tooltip')}>
                                {tooltip && (
                                    <Tooltip title={tooltip}>
                                        <IconInfo />
                                    </Tooltip>
                                )}
                            </span>
                        )
                    }
                    {required && layout === 'horizontal' && (
                        <span className={cx({required})}>*</span>
                    )}
                </label>
            )}
            <div className={cx('input', {error: hasError})}>
                <div className={cx('control')}>
                    {children}
                </div>
                {printableErrors.map(({text, level}, index) => (
                    // eslint-disable-next-line
                    <div key={index} className={cx('error-message', `level-${level}`)}>
                        {LevelIconMap[level]}
                        {text}
                    </div>
                ))}
                {hints.map((text, i) => (
                    // eslint-disable-next-line
                    <div key={i} className={cx('hint')}>
                        {text}
                    </div>
                ))}
            </div>
            {
                layout === 'horizontal' && (
                    <span className={cx('tooltip-hori')}>
                        {tooltip && (
                            <Tooltip title={tooltip}>
                                <IconRemark />
                            </Tooltip>
                        )}
                    </span>
                )
            }
        </div>
    );
};

export default Layout;
