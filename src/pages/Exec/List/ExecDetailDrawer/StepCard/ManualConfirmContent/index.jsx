import {useMemo} from 'react';
import {Button} from '@osui/ui';

import {RUNNING} from '../../../constant';
import cx from '../index.less';

export const ManualConfirmContent = ({
    informUserIds,
    currentUser,
    stageConfirmResult,
    detail,
    manualConfirmDescContents,
    confirmLoading,
    handleToggleNoPassReasonModal,
    handlePass,
}) => {
    // 当前用户是否是确认人
    const isConfirmUser = informUserIds.includes(currentUser?.userId);

    const showOperation = useMemo(() => {
        return isConfirmUser && !stageConfirmResult && detail?.runStatus === RUNNING.value;
    }, [isConfirmUser]);

    return (
        <div className={cx('desc-container')}>
            {
                manualConfirmDescContents.map(item => {
                    return (
                        <div className={cx('desc-item')} key={item?.label}>
                            <span className={cx('label')}>{item?.label}</span>
                            <span className={cx('value')}>{item?.value}</span>
                        </div>
                    );
                })
            }

            {showOperation && (
                <div className={cx('operations')}>
                    <Button
                        danger
                        loading={confirmLoading}
                        className={cx('deny-button')}
                        onClick={handleToggleNoPassReasonModal}
                    >不通过
                    </Button>
                    <Button
                        loading={confirmLoading}
                        type="primary"
                        className={cx('confirm-button')}
                        onClick={handlePass}
                    >通过
                    </Button>
                </div>
            )}
        </div>
    );
};

export default ManualConfirmContent;
