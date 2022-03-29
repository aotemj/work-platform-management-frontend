// 周期执行
import {Input} from '@osui/ui';

import cx from './index.less';

// TODO 暂时搁置，PM需要再优化一下 cron 表达式的具体需求
const LoopExecute = () => {
    // const minuteSelectProps = {
    //     options: new Array(60).fill(0).map((item, index) => {
    //         return {label: index + 1, value: index + 1};
    //     }),
    //     getPopupContainer: triggerNode => triggerNode.parentNode,
    //     className: cx('loop-execute-selector'),
    //     // placeholder: '请选择脚本',
    //     showSearch: true,
    //     allowClear: true,
    //     // disabled: isViewing,
    //     // onChange: handleChangeImportScript,
    //     // value: formData.chooseScript,
    // };
    return (
        <div className={cx('loop-execute-selector')}>
            <div className={cx('labels')}>
                <div className={cx('inner')}>
                    <div className={cx('minute')}>分</div>
                    <div className={cx('hour')}>时</div>
                    <div className={cx('day')}>日</div>
                    <div className={cx('month')}>月</div>
                    <div className={cx('week')}>周</div>
                </div>
            </div>
            <div className={cx('select-container')}>
                <div className={cx('inner')}>
                    <Input
                        bordered={false}
                        className={cx('minute', 'input-item')}
                        placeholder={'分'}
                        maxLength={2}
                    />
                    <Input className={cx('hour', 'input-item')} placeholder={'时'} />
                    <Input className={cx('day', 'input-item')} placeholder={'日'} />
                    <Input className={cx('month', 'input-item')} placeholder={'月'} />
                    <Input className={cx('week', 'input-item')} placeholder={'周'} />
                </div>
            </div>
        </div>
    );
};

export default LoopExecute;
