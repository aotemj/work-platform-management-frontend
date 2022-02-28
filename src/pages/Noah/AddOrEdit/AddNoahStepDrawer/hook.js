import {useCallback, useMemo, useState} from 'react';
import {Modal} from '@osui/ui';
import {getContainerDOM} from '../../../../utils';
import {RUNNING_ENVIRONMENT, SCRIPTS_ORIGIN, STEP_TYPES} from '../constants';
const defaultFormikValues = {
    type: STEP_TYPES.EXECUTE_SCRIPT.value,
    name: '',
    runningEnvironment: RUNNING_ENVIRONMENT.AGENT.value,
    scriptOrigin: SCRIPTS_ORIGIN.MANUAL_INPUT.value,
    chooseScript: '',
    scriptContent: '',
    targetResourceList: [],
};

const useAddNoahStep = ({onClose, handleChangeStep}) => {
    const [formikValues, setFormikValues] = useState(defaultFormikValues);

    const [disabled, setDisabled] = useState(false);

    const isScriptExecute = useMemo(() => {
        return formikValues.type === STEP_TYPES.EXECUTE_SCRIPT.value;
    }, [formikValues.type]);

    const convertAgent = useCallback(() => {
        return formikValues.targetResourceList.map(item => {
            const {id, status, name: targetResourceName, uuid: targetUuid} = item;
            return {
                id, status, targetResourceName, targetUuid,
            };
        });
    }, [formikValues.targetResourceList]);

    const handleSubmit = useCallback(e => {
        const targetResources = convertAgent();

        // 提交新增
        handleChangeStep({
            ...e,
            targetResourceList: targetResources,
        });
    }, [handleChangeStep, convertAgent]);

    const handleCancel = useCallback(() => {
        Modal.confirm({
            title: '确定要取消添加当前步骤吗？',
            getContainer: getContainerDOM,
            onOk: () => {
                // 重置表单
                setFormikValues(defaultFormikValues);
                onClose();
            },
        });
    }, [onClose]);

    const handleChangeTargetServer = useCallback((agents, values) => {
        setFormikValues({
            ...values,
            targetResourceList: agents,
        });
    }, [formikValues]);

    return {
        formikValues,
        setFormikValues,
        disabled,
        setDisabled,
        handleSubmit,
        handleCancel,
        handleChangeTargetServer,
        isScriptExecute,
    };
};
export default useAddNoahStep;
