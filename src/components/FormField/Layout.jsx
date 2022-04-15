import React, {useMemo} from 'react';
import {isNil} from 'ramda';
import {Tooltip} from '@osui/ui';

import {ReactComponent as IconInfo} from '../../statics/icons/info.svg';
import {ReactComponent as IconRemark} from '../../statics/icons/remark.svg';

import cx from './index.less';
import {LevelIconMap} from '../../constant';

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
    hideLabel = false,
    // ...rest
}) => {
    const hasError = useMemo(
        () => Array.isArray(errors) && errors.some(e => (e && 'text' in e)),
        [errors],
    );

    const printableErrors = useMemo(
        () => {
            if (Array.isArray(errors)) {
                const errorMap = {};
                errors.forEach(e => {
                    if (e) {
                        if (!e?.text) {
                            for (const eElement of Object.values(e)) {
                                errorMap[eElement[0].text] = eElement[0];
                            }
                        } else {
                            errorMap[e.text] = e;
                        }
                    }

                });
                return Object.values(errorMap);
            }
            return [];
        },
        [errors],
    );
    return (
        <div
            className={cx('root', layout, {'no-label': isNil(label)}, className)}
            style={style}
        >
            {!hideLabel && !isNil(label) && (
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
                    <div key={index} className={cx('error-message', `level-${level}`)}>
                        {LevelIconMap[level]}
                        {text}
                    </div>
                ))}
                {hints.map((text, i) => (
                    <div key={i} className={cx('hint')}>
                        {text}
                    </div>
                ))}
            </div>
            {
                layout === 'horizontal' && (
                    <span className={cx('tooltip-horizontal')}>
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
