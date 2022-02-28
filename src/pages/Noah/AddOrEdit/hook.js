import {useNavigate, useParams} from 'react-router-dom';
import {useCallback, useState} from 'react';
import {Modal} from '@osui/ui';
import {getContainerDOM} from '../../../utils';
import {clone} from 'ramda';
import useCategory from './hooks/category';

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
    // 方案名称
    name: '',
    // 分类
    category: '',
    // 作业描述
    description: '',
    // 全局变量
    variable: [],
    // 作业步骤
    step: [],
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
    const title = '编辑作业';
    return {
        title,
    };
};

const useAddOrEdit = () => {
    const params = useParams();
    const navigate = useNavigate();

    const {
        categories,
        handleSubmitAddCategory,
    } = useCategory();

    const goBack = useCallback(() => {
        navigate(-1);
    }, []);

    const [addCategoryVisible, setAddCategoryVisible] = useState(false);

    const [editing, setEditing] = useState(true);

    const [formikValues, setFormikValues] = useState(defaultFormikValues);

    const [disabled, setDisabled] = useState(false);

    const [globalVariables, setGlobalsVariables] = useState(mockGlobalVariables);

    const [globalVariableVisible, setGlobalVariableVisible] = useState(false);

    const [addStepDrawerVisible, setAddStepDrawerVisible] = useState(true);

    // TODO 动态化
    // const [categories, setCategories] = useState(mockCategories);

    const [stageList, setStageList] = useState([]);

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

    const handleAddStep = useCallback(() => {
        setAddStepDrawerVisible(true);
    }, []);

    // 新建步骤
    const handleChangeStep =  useCallback(e => {
        setStageList([...stageList, e]);
        setAddStepDrawerVisible(false);
    }, [stageList]);

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
        addStepDrawerVisible,
        setAddStepDrawerVisible,
        handleAddStep,
        handleChangeStep,
        stageList,
        handleSubmitAddCategory,
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


