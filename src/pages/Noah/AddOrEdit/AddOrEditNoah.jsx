/**
 * 新建、 编辑、 执行作业
 * tip: 当前组件有三个状态：
 *  1. 新建 表单可以编辑 不可修改步骤启停状态
 *  2. 编辑 表单可以编辑 不可修改步骤启停状态
 *  3. 执行作业 表单不可编辑 可以修改步骤启停状态
 */
import * as yup from 'yup';
import {Button, Input, PageHeader, Select} from '@osui/ui';
import {IconPlusOutlined} from '@osui/icons';

import cx from './index.less';
import SelectAll from '../../../components/SelectAll';
import AddCategoryModal from './AddCategoryModal';
import FormikComp from '../../../components/FormikComp';
import useAddOrEdit from './hook';
import GlobalVariableItem from './GlobalVariableItem';
import AddGlobalVariableDrawer from './AddGlobalVariableDrawer';
import StepItem from './StepItem';
import AddNoahStepDrawer from './AddNoahStepDrawer/index';
import {DELETE_SYMBOL} from '../../../constant';
import {debounceWith250ms, loadMoreCallBackByScrolling} from '../../../utils';

const {Option} = Select;

const {TextArea} = Input;

/**
 * 新建\编辑 作业方案
 */
const dropdownRender = (originNode, handleAddCallback, values) => {
    return (
        <>
            {originNode}
            <li className={cx('dropdown-add-button')} onClick={() => handleAddCallback(values)}>
                <IconPlusOutlined />
                <span className={cx('add-text')}>新增</span>
            </li>
        </>
    );
};

const AddOrEditNoah = props => {
    const {
        getNoahWorkPlanDetail,
        noahDetail,
        categories: {list: categories, map: categoryMap, currentPage: categoryCurrentPage},
        getCategoryList,
        updateCategory,
        updateNoahDetail,
    } = props;
    const {
        goBack,
        goBackWithConfirm,
        title,
        formikValues,
        setDisabled,
        handleSubmit,
        disabled,
        handleCancelOperate,
        editing,
        isExecuting,
        handleRemoveStageList,
        formRef,

        // category
        addCategoryVisible,
        handleAddCategory,
        setAddCategoryVisible,
        handleSubmitAddCategory,

        // variable
        handleAddGlobalVariable,
        globalVariables,
        handleRemoveGlobalVariable,
        globalVariableVisible,
        setGlobalVariableVisible,
        handleStartEditVariable,
        globalVariableEditingValue,
        handleChangeGlobalVariable,

        // step
        addStepDrawerVisible,
        setAddStepDrawerVisible,
        handleChangeStep,
        handleStartEditStep,
        stepEditingValue,
        setStepEditingValue,
        handleStartAddStep,
        handleExecute,
    } = useAddOrEdit({
        getNoahWorkPlanDetail,
        noahDetail,
        categories,
        categoryMap,
        getCategoryList,
        updateCategory,
        updateNoahDetail,
    });

    const defaultField = {
        layout: 'horizontal',
    };

    const filterDeleteSymbol = item => item.status !== DELETE_SYMBOL;
    const filterStageList = formikValues.stageList.filter(filterDeleteSymbol);

    const formFields = {
        name: {
            ...defaultField,
            name: 'name',
            label: '作业名称',
            required: true,
            MAX_LENGTH: 80,
            children: ({field}) => {
                const {MAX_LENGTH} = formFields.name;
                return (
                    <Input
                        maxLength={MAX_LENGTH}
                        placeholder={`请输入1~${MAX_LENGTH}位作业名称`}
                        disabled={isExecuting}
                        suffix={<span>{field.value.length}/{MAX_LENGTH}</span>}
                        {...field}
                    />
                );
            },
            validate: yup
                .string()
                .ensure()
                .trim()
                .required('请输入作业名称')
                .max(80, '作业名称限80个字符'),
        },
        category: {
            ...defaultField,
            name: 'category',
            label: '分类',
            children: ({field, form: {values}}) => (
                <SelectAll
                    disabled={isExecuting}
                    className={cx('category-dropdown')}
                    dropdownRender={originNode => dropdownRender(originNode, handleAddCategory, values)}
                    placeholder="请选择或新增作业分类"
                    onPopupScroll={debounceWith250ms(e => {
                        loadMoreCallBackByScrolling(e, {dispatch: getCategoryList, currentPage: categoryCurrentPage});
                    })}
                    {...field}
                >
                    {
                        categories.map(item => {
                            return <Option value={item.id || item.name} key={item.name}>{item.name}</Option>;
                        })
                    }
                </SelectAll>
            ),
            validate: null,
        },
        noahDescribes: {
            ...defaultField,
            name: 'noahDescribes',
            label: '作业描述',
            MAX_LENGTH: 500,
            validate: null,
            children: ({field}) => (
                <TextArea
                    disabled={isExecuting}
                    width={'500px'}
                    showCount
                    className={cx('noah-textarea')}
                    autoSize={{minRows: 5}}
                    maxLength={formFields.noahDescribes.MAX_LENGTH}
                    placeholder="请输入作业描述"
                    {...field}
                />
            ),
        },
        variable: {
            ...defaultField,
            name: 'variable',
            label: '全局变量',
            children: ({form: {values}}) => {
                const length = globalVariables.length;
                return (
                    <div className={cx('variable-container')}>
                        {
                            globalVariables.filter(filterDeleteSymbol).map(globalVariable => {
                                return (
                                    <GlobalVariableItem
                                        handleClose={handleRemoveGlobalVariable}
                                        handleEdit={() => handleStartEditVariable(globalVariable)}
                                        key={globalVariable.name}
                                        disabled={isExecuting}
                                        {...globalVariable}
                                    />
                                );
                            })
                        }
                        {
                            !length && isExecuting && <span className={cx('no-data')}>暂无全局变量</span>
                        }
                        {
                            !isExecuting && (
                                <Button
                                    onClick={() => handleAddGlobalVariable(values)}
                                    icon={<IconPlusOutlined />}
                                    className={cx('add-variable-button')}
                                >添加全局变量
                                </Button>
                            )
                        }
                    </div>
                );
            },
            validate: null,
        },
        stageList: {
            ...defaultField,
            name: 'stageList',
            label: '作业步骤',
            required: true,
            children: ({form: {values}}) => (
                <div className={cx('step-container')}>
                    {
                        filterStageList.map((stage, index) => {
                            const key = stage?.id || stage?.key;
                            return (
                                <div
                                    key={key}
                                    className={cx('step-item-container', isExecuting ? 'disabled' : null)}
                                >
                                    <span className={cx('index')}>{index + 1}</span>
                                    <StepItem
                                        handleClose={e => handleRemoveStageList(e, stage)}
                                        handleEdit={e => handleStartEditStep(e, stage)}
                                        index={index}
                                        {...stage}
                                        editing={editing}
                                        isExecuting={isExecuting}
                                    />
                                </div>
                            );
                        })
                    }
                    {
                        !isExecuting && (
                            <Button
                                onClick={() => handleStartAddStep(values)}
                                icon={<IconPlusOutlined />}
                                className={cx('add-step-button')}
                            >添加作业步骤
                            </Button>
                        )
                    }

                </div>
            ),
            validate: yup
                .array()
                .min(1, '请至少选择一个作业步骤')
                .ensure(),
        },
    };

    const addCategoryModalProps = {
        visible: addCategoryVisible,
        setVisible: setAddCategoryVisible,
        handleSubmitAddCategory,
    };

    const globalVariableVisibleProps = {
        visible: globalVariableVisible,
        setVisible: setGlobalVariableVisible,
        onClose: () => setGlobalVariableVisible(false),
        globalVariableEditingValue,
        handleChangeGlobalVariable,
    };

    const noahStepProps = {
        visible: addStepDrawerVisible,
        setVisible: setAddStepDrawerVisible,
        onClose: () => setAddStepDrawerVisible(false),
        handleChangeStep,
        stepEditingValue,
        setStepEditingValue,
        editing,
        isExecuting,
    };

    const ExecuteFooter = () => (
        <div className={cx('execute-footer')}>
            <Button
                type={'primary'}
                onClick={handleExecute}
                className={cx('confirm-button')}
            >执行
            </Button>
            <Button onClick={goBack}>返回方案列表</Button>
        </div>
    );

    const formikProps = {
        handleSubmit,
        initialValues: formikValues,
        disabled,
        setDisabled,
        formFields,
        handleCancel: handleCancelOperate,
        transformRef: form => {
            formRef.current = form;
        },
    };

    if (isExecuting) {
        formikProps.Footer = ExecuteFooter;
    }

    return (
        <div className={cx('add-container')}>
            <PageHeader title={title} onBack={goBackWithConfirm} />
            <div className={cx('outer')}>
                <FormikComp {...formikProps} />
            </div>
            {addCategoryVisible && <AddCategoryModal {...addCategoryModalProps} />}
            <AddGlobalVariableDrawer {...globalVariableVisibleProps} />
            <AddNoahStepDrawer {...noahStepProps} />
        </div>
    );
};

export default AddOrEditNoah;
