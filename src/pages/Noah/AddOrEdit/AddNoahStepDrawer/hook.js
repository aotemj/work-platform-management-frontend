import {useCallback, useMemo, useState} from 'react';
import {Modal} from '@osui/ui';

import {getContainerDOM} from '../../../../utils';
import {RUNNING_ENVIRONMENT, SCRIPT_TYPES, SCRIPTS_ORIGIN, STEP_TYPES} from '../constants';

const defaultFormikValues = {
    type: STEP_TYPES.EXECUTE_SCRIPT.value,
    name: '',
    runningEnvironment: RUNNING_ENVIRONMENT.AGENT.value,
    scriptOrigin: SCRIPTS_ORIGIN.MANUAL_INPUT.value,
    chooseScript: '',
    scriptContents: '',
    targetResourceList: [],
    // 脚本语言类型
    scriptLanguage: SCRIPT_TYPES[0].key,
    scriptParams: '',
    timeoutValue: 0,
};

const useAddNoahStep = ({onClose, handleChangeStep}) => {
    const [formikValues, setFormikValues] = useState(defaultFormikValues);

    const [disabled, setDisabled] = useState(false);
    const [agentMapByUuid, setAgentMapByUuid] = useState({});

    const isScriptExecute = useMemo(() => {
        return formikValues.type === STEP_TYPES.EXECUTE_SCRIPT.value;
    }, [formikValues.type]);

    const handleSubmit = useCallback((e, stepEditingValue) => {
        // const targetResources = convertAgent();
        handleChangeStep(e, stepEditingValue);
        setFormikValues(defaultFormikValues);

    }, [handleChangeStep]);

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

    const handleEditTargetServer = useCallback(() => {

    }, []);

    const handleAddTargetServer = useCallback((agents, values, agentMap) => {
        setFormikValues({
            ...values,
            targetResourceList: agents,
        });
        setAgentMapByUuid(agentMap);
    }, []);

    const handleChangeTargetServer = useCallback(({agents, values, agentMap, editing}) => {
        if (editing) {
            handleEditTargetServer(agents, values, agentMap);
        } else {
            handleAddTargetServer(agents, values, agentMap);
        }
    }, [handleAddTargetServer, handleEditTargetServer]);

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
