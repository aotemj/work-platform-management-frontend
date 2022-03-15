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
import AddNoahStepDrawer from './AddNoahStepDrawer';

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

const AddOrEdit = () => {
    const {
        goBack,
        title,
        categories,
        formikValues,
        setDisabled,
        handleSubmit,
        disabled,
        handleCancelOperate,
        editing,
        handleRemoveStageList,

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
    } = useAddOrEdit();

    const defaultField = {
        layout: 'horizontal',
    };

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
            DEFAULT_TAG_MAX_COUNT: Math.min(categories.length, 3),
            children: ({field, form: {values}}) => (
                <SelectAll
                    className={cx('category-dropdown')}
                    dropdownRender={originNode => dropdownRender(originNode, handleAddCategory, values)}
                    placeholder="请选择或新增作业分类"
                    maxTagCount={Math.min(categories.length, formFields.category.DEFAULT_TAG_MAX_COUNT)}
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
            children: ({form: {values}}) => (
                <div className={cx('variable-container')}>
                    {
                        globalVariables.map(globalVariable => {
                            return (
                                <GlobalVariableItem
                                    handleClose={handleRemoveGlobalVariable}
                                    handleEdit={() => handleStartEditVariable(globalVariable)}
                                    key={globalVariable.title}
                                    {...globalVariable}
                                />
                            );
                        })
                    }
                    <Button
                        onClick={() => handleAddGlobalVariable(values)}
                        icon={<IconPlusOutlined />}
                        className={cx('add-variable-button')}
                    >添加全局变量
                    </Button>
                </div>
            ),
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
                        formikValues.stageList.map((stage, index) => {
                            const key = stage?.id || stage?.key;
                            return (
                                <div
                                    key={key}
                                    className={cx('step-item-container')}
                                >
                                    <span className={cx('index')}>{index + 1}</span>
                                    <StepItem
                                        handleClose={e => handleRemoveStageList(e, stage)}
                                        handleEdit={e => handleStartEditStep(e, stage)}
                                        index={index}
                                        {...stage}
                                        editing={editing}
                                    />
                                </div>
                            );
                        })
                    }
                    <Button
                        onClick={() => handleStartAddStep(values)}
                        icon={<IconPlusOutlined />}
                        className={cx('add-step-button')}
                    >添加作业步骤
                    </Button>
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
    };
    const formikProps = {
        handleSubmit,
        initialValues: formikValues,
        disabled,
        setDisabled,
        formFields,
        handleCancel: handleCancelOperate,
    };

    return (
        <div className={cx('add-container')}>
            <PageHeader title={title} onBack={goBack} />
            <div className={cx('outer')}>
                <FormikComp {...formikProps} />
            </div>
            {addCategoryVisible && <AddCategoryModal {...addCategoryModalProps} />}
            <AddGlobalVariableDrawer {...globalVariableVisibleProps} />
            <AddNoahStepDrawer {...noahStepProps} />
        </div>
    );
};

export default AddOrEdit;
