import {propOr} from 'ramda';

import cx from './index.less';
import {DEFAULT_STRING_VALUE} from '../../../../../constant';

const NoahItem = ({label, content}) => (
    <div className={cx('item')}>
        <div className={cx('label')}>{label}</div>
        <div className={cx('content')}>{content}</div>
    </div>
);
const NoahDetail = ({noahDetail}) => {
    const nameObj = {
        label: '名称',
        content: propOr(DEFAULT_STRING_VALUE, 'name', noahDetail),
    };

    const categoryObj = {
        label: '方案分类',
        content: propOr([], 'category', noahDetail),
    };

    return (
        <div className={cx('noah-detail-container')}>
            <NoahItem {...nameObj} />
        </div>
    );
};

export default NoahDetail;
