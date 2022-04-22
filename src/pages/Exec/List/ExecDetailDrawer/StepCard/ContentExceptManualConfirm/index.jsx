// 人工确认
import {Button} from '@osui/ui';

import TimeItem from '../TimeItem';
import cx from '../index.less';

export const ContentExceptManualConfirm = ({
    consumeObj,
    operations,
    stepId,
}) => {
    return (
        <>
            <TimeItem item={consumeObj} />
            <div className={cx('right')}>
                {
                    operations.map(operation => {
                        return (
                            <Button
                                type={'link'}
                                disabled={operation?.disabled}
                                key={operation.label}
                                onClick={() => operation.execution({id: stepId})}
                            >{operation.label}
                            </Button>
                        );
                    })
                }
            </div>
        </>
    );
};

export default ContentExceptManualConfirm;
