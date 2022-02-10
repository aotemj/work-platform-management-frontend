import {Button} from '@osui/ui';
import cx from './index.less';
const AddButton = ({test}) => (
    <Button type="primary">
        <span className={cx('add-button')}>+</span>
        <span>{test}</span>
    </Button>
);

export default AddButton;
