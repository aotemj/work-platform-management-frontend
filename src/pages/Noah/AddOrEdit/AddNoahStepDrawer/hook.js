import {useCallback, useMemo, useState} from 'react';
import {message, Modal} from '@osui/ui';

import {getContainerDOM} from '../../../../utils';
import {
    RUNNING_ENVIRONMENT,
    SCRIPT_TYPES,
    SCRIPTS_ORIGIN,
    STEP_TYPES,
    UPDATE_FILE_STATUS,
} from '../constants';
import {DEFAULT_STRING_VALUE} from '../../../../constant';

const defaultFormikValues = {
    // type: STEP_TYPES.EXECUTE_SCRIPT.value,
    type: STEP_TYPES.FILE_DISTRIBUTION.value,
    name: '',
    // about execute script
    runningEnvironment: RUNNING_ENVIRONMENT.AGENT.value,
    scriptOrigin: SCRIPTS_ORIGIN.MANUAL_INPUT.value,
    chooseScript: '',
    scriptContents: '',
    targetResourceList: [],
    scriptLanguage: SCRIPT_TYPES[0].key,
    scriptParams: '',
    timeoutValue: 0,

    // about file distribution
    // 文件
    uploadLimitDisabled: true,
    // 后端单位kb, 接口提交需要前端转换
    uploadLimit: 0,
    downloadLimitDisabled: true,
    downloadLimit: 0,
    storageFileList: [
        // {
        //     key: 0,
        //     sourcePath: '123123',
        //     fileSource: FILE_SOURCE_TYPE.SERVER,
        //     sourceResourceName: '8809a811-195f-45fd-9bac-237abe904f25',
        // },
    ],
    transmissionMode: 1,
    targetPath: '',
};

const useAddNoahStep = ({onClose, handleChangeStep}) => {
    const [formikValues, setFormikValues] = useState(defaultFormikValues);

    const [disabled, setDisabled] = useState(false);

    const [agentMapByUuid, setAgentMapByUuid] = useState({});

    const [userInputError, setUserInputError] = useState(false);

    const isScriptExecute = useMemo(() => {
        return formikValues.type === STEP_TYPES.EXECUTE_SCRIPT.value;
    }, [formikValues.type]);

    const isFileDistribution = useMemo(() => {
        return formikValues.type === STEP_TYPES.FILE_DISTRIBUTION.value;
    }, [formikValues.type]);

    // 文件路径禁止重复， 同一台主机下
    // 本地文件如果还处于上传中，则禁止保存
    const checkStorageListAvailable = useCallback(e => {
        const {storageFileList} = e;
        const length = storageFileList.length;

        let tempMap = {};
        for (let i = 0; i < length; i++) {
            const {sourcePath, sourceResourceName, status} = storageFileList[i];
            // 本地上传文件
            if (sourcePath === DEFAULT_STRING_VALUE) {
                if (status === UPDATE_FILE_STATUS.LOADING) {
                    message.error('当前有本地文件未上传完成，请等待上传成功后保存');
                    return false;
                }
                continue;

            }

            // 服务器文件
            if (tempMap[`${sourcePath}${DEFAULT_STRING_VALUE}${sourceResourceName}`]) {
                message.error('请勿填写一台主机上的相同路径');
                return false;
            }
            tempMap[`${sourcePath}${DEFAULT_STRING_VALUE}${sourceResourceName}`] = 1;
        }
        return true;

    }, []);


    const handleSubmit = useCallback((e, stepEditingValue) => {
        const available = checkStorageListAvailable(e);

        if (!available) {
            setUserInputError(true);
            return false;
        }

        setUserInputError(false);

        handleChangeStep(e, stepEditingValue);
        setFormikValues(defaultFormikValues);

    }, [checkStorageListAvailable, handleChangeStep]);

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
        isFileDistribution,
        userInputError,
        setUserInputError,
    };
};
export default useAddNoahStep;
