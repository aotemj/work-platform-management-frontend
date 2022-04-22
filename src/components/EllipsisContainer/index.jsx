import {Tooltip} from '@osui/ui';
import cx from './index.less';

const EllipsisContainer = ({val}) => (
    <Tooltip title={val}>
        <div className={cx('max-width')}>
            {val}
        </div>
    </Tooltip>
);

export default EllipsisContainer;
