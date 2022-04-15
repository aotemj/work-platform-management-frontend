import {useCallback, useEffect, useState} from 'react';
import {clone, omit} from 'ramda';
import {Modal} from '@osui/ui';

import {getContainerDOM, Toast} from '../../../../utils';
import {ERROR_MSG, GLOBAL_VARIABLE_TYPES} from '../constants';
import {DELETE_SYMBOL} from '../../../../constant';

const defaultFormikValues = {
    type: GLOBAL_VARIABLE_TYPES.STRING.value,
    name: '',
    value: '',
    describes: '',
    exeChange: false,
    exeRequired: false,
};

const useGlobalVariable = ({
    handleChangeVariable,
    setVisible,
    onClose,
    visible,
}) => {
    const [globalVariables, setGlobalsVariables] = useState([]);

    const [variableMap, setVariableMap] = useState({});

    const [formikValues, setFormikValues] = useState(defaultFormikValues);

    const [disabled, setDisabled] = useState(false);

    const [showCrypto, setShowCrypto] = useState(true);
    // 已删除的全局变量
    const [deletedGlobalVariables, setDeletedGlobalVariables] = useState([]);

    const handleCancel = useCallback(() => {
        Modal.confirm({
            title: '确定要取消添加变量吗？',
            getContainer: getContainerDOM,
            onOk: () => {
                setFormikValues(defaultFormikValues);
                setVisible(false);
                onClose();
            },
        });
    }, [onClose, setVisible]);

    const resetForm = () => {
        setFormikValues(defaultFormikValues);
    };

    // 删除全局变量
    const handleRemoveGlobalVariable = useCallback(globalVariable => {
        const {index} = globalVariable;
        const tempArray =  clone(globalVariables);
        tempArray[index] = {
            ...globalVariable,
            status: DELETE_SYMBOL,
        };
        setGlobalsVariables(tempArray);
        resetForm();
    }, [globalVariables]);

    // 编辑全局变量
    const handleEditGlobalVariable = useCallback((e, originData) => {
        const {name, index} = originData;
        const origin = variableMap[name];

        // update array
        const tempArr = clone(globalVariables);
        tempArr[index] = {...origin, ...e};
        setGlobalsVariables(tempArr);

        // update map
        setVariableMap({
            ...omit([name], variableMap),
            [e.name]: e,
        });
        // reset
        resetForm();
        Toast.success('保存成功');
        handleChangeVariable(tempArr);
    }, [globalVariables, handleChangeVariable, variableMap]);

    // 新增全局变量
    const handleAddGlobalVariable = useCallback(e => {
        const {name} = e;
        if (variableMap[name]) {
            return Toast.error(ERROR_MSG.VARIABLE_ALREADY_EXIST);
        }
        const item = {
            ...e,
            index: globalVariables.length,
        };

        const newVariables = [...globalVariables, item];
        setGlobalsVariables(newVariables);

        setVariableMap({
            ...variableMap,
            [name]: item,
        });
        Toast.success('添加成功');
        resetForm();
        handleChangeVariable(newVariables);
    }, [globalVariables, handleChangeVariable, variableMap]);

    // 更新全局变量
    const handleChangeGlobalVariable = useCallback((e, editing, originData) => {
        if (editing) {
            handleEditGlobalVariable(e, originData);
        } else {
            handleAddGlobalVariable(e);
        }
    }, [handleEditGlobalVariable, handleAddGlobalVariable]);

    useEffect(() => {
        resetForm();
        setDeletedGlobalVariables([]);
    }, [visible]);

    return {
        globalVariables,
        handleRemoveGlobalVariable,
        handleEditGlobalVariable,
        handleChangeGlobalVariable,
        formikValues,
        showCrypto,
        setDisabled,
        disabled,
        setShowCrypto,
        handleCancel,
        setFormikValues,
        setGlobalsVariables,
        setVariableMap,
        deletedGlobalVariables,
    };
};

export default useGlobalVariable;
