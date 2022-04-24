import {propOr} from 'ramda';
import {Spin} from '@osui/ui';

import cx from './index.less';
import {DEFAULT_STRING_VALUE, DELETE_SYMBOL} from '../../../../../constant';
import GlobalVariableItem from '../../../../Noah/AddOrEdit/GlobalVariableItem';
import StepItem from '../../../../Noah/AddOrEdit/StepItem';

const NoahItem = ({
    label,
    content,
}) => (
    <div className={cx('item')}>
        <div className={cx('label')}>{label}</div>
        <div className={cx('content')}>{content}</div>
    </div>
);
const NoahDetail = ({
    noahDetail,
    noahOriginalDetail,
    loading,
}) => {
    const filterDeleteSymbol = item => item.status !== DELETE_SYMBOL;

    const filterStageList = propOr([], 'stageList', noahDetail).filter(filterDeleteSymbol);

    const nameObj = {
        label: '方案名称',
        content: propOr(DEFAULT_STRING_VALUE, 'name', noahDetail),
    };

    const categoryObj = {
        label: '方案分类',
        content: noahOriginalDetail?.workPlan?.typeNames,
    };
    const descriptionObj = {
        label: '方案描述',
        content: propOr(DEFAULT_STRING_VALUE, 'noahDescribes', noahDetail),
    };

    const globalVariablesObj = {
        label: '全局变量',
        content: (
            <div className={cx('variable-container')}>
                {
                    propOr([], 'variable', noahDetail).map(variable => (
                        <GlobalVariableItem
                            key={variable.name}
                            disabled
                            {...variable}
                        />
                    ))
                }
            </div>
        ),
    };

    const noahStepsObj = {
        label: '作业步骤',
        content: (
            <div className={cx('step-container')}>
                {
                    filterStageList.map((stage, index) => {
                        const key = stage?.id || stage?.key;
                        return (
                            <div
                                key={key}
                                className={cx('step-item-container', 'disabled')}
                            >
                                <span className={cx('index')}>{index + 1}</span>
                                <StepItem
                                    index={index}
                                    {...stage}
                                    editing={false}
                                    disabled
                                />
                            </div>
                        );
                    })
                }
            </div>
        ),
    };

    const contents = [
        nameObj,
        categoryObj,
        descriptionObj,
        globalVariablesObj,
        noahStepsObj,
    ];

    return (
        <Spin spinning={loading}>
            <div className={cx('noah-detail-container')}>
                {
                    contents.map(item => <NoahItem key={item.label} {...item} />)
                }
            </div>
        </Spin>
    );
};

export default NoahDetail;
