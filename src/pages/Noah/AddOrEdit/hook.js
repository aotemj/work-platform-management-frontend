import {useNavigate, useParams} from 'react-router-dom';
import {useCallback, useState} from 'react';
import {Modal} from '@osui/ui';
import {getContainerDOM} from '../../../utils';
import {clone} from 'ramda';

const mockCategories = [
    {
        label: '123',
        value: '123',
    }, {

        label: '1231',
        value: '1231',
    }];

const mockGlobalVariables = [
    {
        id: '1',
        type: 'STRING',
        title: '变量名AB',
        value: '123123123',
    },
    {
        id: '2',
        type: 'SECRET_KEY',
        title: '变量名A',
        value: '123123123',
    },
];

const defaultFormikValues = {
    name: '',
    code: '',
    content: '',
    grantGroups: [],
};

// 添加
const handleAdd = () => {
    const title = '新建作业';
    return {
        title,
    };
};

// 编辑
const handleEdit = detailId => {
    console.log(detailId);
    const title = '编辑作业';
    return {
        title,
    };
};

const useAddOrEdit = () => {
    const params = useParams();
    const navigate = useNavigate();
    const goBack = useCallback(() => {
        navigate(-1);
    }, []);

    const [addCategoryVisible, setAddCategoryVisible] = useState(false);

    const [editing, setEditing] = useState(true);

    const [formikValues, setFormikValues] = useState(defaultFormikValues);

    const [disabled, setDisabled] = useState(false);

    const [globalVariables, setGlobalsVariables] = useState(mockGlobalVariables);

    const [globalVariableVisible, setGlobalVariableVisible] = useState(true);

    // TODO 动态化
    const [categories, setCategories] = useState(mockCategories);

    const handleSubmit = useCallback(() => {
        console.log('submit');
    }, []);

    const handleCancelOperate = useCallback(() => {
        Modal.info({
            title: '确定要取消操作吗？',
            onOk: goBack,
            getContainer: getContainerDOM,
        });
    }, []);

    const handleAddCategory = useCallback(() => {
        setAddCategoryVisible(true);
    }, []);

    const handleAddGlobalVariable = useCallback(() => {
        setGlobalVariableVisible(true);
    }, []);

    const handleRemoveGlobalVariable = useCallback(globalVariable => {
        const {id} = globalVariable;
        const tempArray =  clone(globalVariables);
        const length = tempArray.length;

        for (let i = 0; i < length; i++) {
            if (id === tempArray[i].id) {
                tempArray.splice(i, 1);
                break;
            }
        }

        setGlobalsVariables(tempArray);

    }, [globalVariables]);

    const common = {
        goBack,
        categories,
        setDisabled,
        handleSubmit,
        disabled,
        addCategoryVisible,
        formikValues,
        handleCancelOperate,
        handleAddCategory,
        setAddCategoryVisible,
        handleAddGlobalVariable,
        globalVariables,
        handleRemoveGlobalVariable,
        editing,
        globalVariableVisible,
        setGlobalVariableVisible,
    };

    if (params?.detailId) {
        return {
            ...common,
            ...handleEdit(params.detailId),
        };
    }

    return {
        ...common,
        ...handleAdd(),
    };
};

export default useAddOrEdit;


