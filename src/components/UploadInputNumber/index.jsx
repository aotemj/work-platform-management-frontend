/**
 * 上传限速、 下载限速 input number 封装
 */
import {InputNumber} from '@osui/ui';

import cx from './index.less';
import {parseIntForDecimal} from '../../utils';
import {deConvertFileSize} from '../../utils/convertNoahDetail';
import {MAGE_BYTE_SCALE} from '../../constant';

const integerFormatter = val => {
    return val ? parseIntForDecimal(val) : 0;
};
const AddAfter = props => {
    return (
        <span className={cx('upload-addon-after')}>
            KB/s
            <span className={cx('assessment')}>约为 {deConvertFileSize(props.value)} MB/s</span>
        </span>
    );
};
const UploadInputNumber = props => {
    return (
        <InputNumber
            {...props}
            className={cx('time-out-input')}
            formatter={integerFormatter}
            addonAfter={<AddAfter {...props} />}
            step={MAGE_BYTE_SCALE}
        />
    );
};

export default UploadInputNumber;
