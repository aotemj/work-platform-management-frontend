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

const {Option} = Select;

const {TextArea} = Input;

/**
 * 新建\编辑 作业方案
 */
const dropdownRender = (originNode, handleAddCallback) => {
    return (
        <>
            {originNode}
            <li className={cx('dropdown-add-button')} onClick={handleAddCallback}>
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
        addCategoryVisible,
        categories,
        formikValues,
        setDisabled,
        handleSubmit,
        disabled,
        handleCancelOperate,
        handleAddCategory,
        setAddCategoryVisible,
        handleAddGlobalVariable,
        globalVariables,
        editing,
        handleRemoveGlobalVariable,
        globalVariableVisible,
        setGlobalVariableVisible,
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
                        {...field}
                        maxLength={MAX_LENGTH}
                        placeholder={`请输入1~${MAX_LENGTH}位作业名称`}
                        suffix={<span>{field.value.length}/{MAX_LENGTH}</span>}
                    />
                );
            },
            validate: yup
                .string()
                .ensure()
                .trim()
                .test('code', '集群名称仅支持输入中文、字母、数字、下划线、短横线，且必须以中文、字母或数字开头', value =>
                    /^[a-zA-Z0-9\u4e00-\u9fa5][\w-_\u4e00-\u9fa5]*$/.test(value),
                )
                .required('请输入集群名称')
                .max(50, '集群名称限50个字符'),
        },
        category: {
            ...defaultField,
            name: 'category',
            label: '分类',
            DEFAULT_TAG_MAX_COUNT: 3,
            children: ({field}) => (
                <SelectAll
                    className={cx('category-dropdown')}
                    dropdownRender={originNode => dropdownRender(originNode, handleAddCategory)}
                    placeholder="请选择或新增作业分类"
                    maxTagCount={Math.min(categories.length, formFields.category.DEFAULT_TAG_MAX_COUNT)}
                    {...field}
                >
                    {
                        categories.map(item => {
                            return <Option value={item.value} key={item.label}>{item.label}</Option>;
                        })
                    }
                </SelectAll>
            ),
        },
        description: {
            ...defaultField,
            name: 'description',
            label: '作业描述',
            MAX_LENGTH: 500,
            children: ({field}) => (
                <TextArea
                    {...field}
                    width={'500px'}
                    showCount
                    className={cx('noah-textarea')}
                    autoSize={{minRows: 5}}
                    maxLength={formFields.description.MAX_LENGTH}
                    placeholder="请输入作业描述"
                />
            ),
        },
        variable: {
            ...defaultField,
            name: 'variable',
            label: '全局变量',
            // TODO 全局变量自定义
            children: ({field}) => (
                <div className={cx('variable-container')}>
                    {
                        globalVariables.map(globalVariable => {
                            return (
                                <GlobalVariableItem
                                    handleClose={handleRemoveGlobalVariable}
                                    key={globalVariable.title}
                                    {...globalVariable}
                                    editing={editing}
                                />
                            );
                        })
                    }
                    <Button
                        onClick={handleAddGlobalVariable}
                        icon={<IconPlusOutlined />}
                        className={cx('add-variable-button')}
                    >添加全局变量
                    </Button>
                </div>
            ),
        },
        step: {
            ...defaultField,
            name: 'step',
            label: '作业步骤',
            required: true,
            // TODO 全局变量自定义
            children: ({field}) => (
                <Input
                    {...field}
                />
            ),
            validate: yup
                .string()
                .ensure()
                .required('请输入作业步骤'),
        },
    };

    const addCategoryModalProps = {
        visible: addCategoryVisible,
        setVisible: setAddCategoryVisible,
    };

    const globalVariableVisibleProps = {
        visible: globalVariableVisible,
        setVisible: setGlobalVariableVisible,
        onClose: () => setGlobalVariableVisible(false),
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
            <AddCategoryModal {...addCategoryModalProps} />
            <AddGlobalVariableDrawer {...globalVariableVisibleProps} />
        </div>
    );
};

export default AddOrEdit;
