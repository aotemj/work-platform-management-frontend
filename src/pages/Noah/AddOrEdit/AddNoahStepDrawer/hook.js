import {useCallback, useEffect, useState} from 'react';
import {message, Modal} from '@osui/ui';

import {getContainerDOM} from '../../../../utils';
import {
    RUNNING_ENVIRONMENT,
    SCRIPT_TYPES,
    SCRIPTS_ORIGIN,
    NOTICE_APPROACHES, LOADING,
} from '../constants';
import {DEFAULT_STRING_VALUE, STEP_TYPES, COMMON_URL_PREFIX, IS_PROD} from '../../../../constant';
import {request} from '../../../../request/fetch';
import {GLOBAL_URLS} from '../../../../constant/index';
import {TEMP_SCRIPTS} from '../../../../temp/scripts';

const defaultFormikValues = {
    type: STEP_TYPES.EXECUTE_SCRIPT.value,
    name: '',
    // about execute script
    runningEnvironment: RUNNING_ENVIRONMENT.AGENT.value,
    scriptOrigin: SCRIPTS_ORIGIN.MANUAL_INPUT.value,
    chooseScript: null, // number 类型
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

    // 人工确认 相关
    // 通知方式
    informWay: [NOTICE_APPROACHES.EMAIL.value],
    // 通知描述
    describes: '',
    // 通知人员
    informUserId: [],
};

const useAddNoahStep = ({onClose, handleChangeStep, stepEditingValue, setStepEditingValue, getUsersFromOne}) => {

    const [formikValues, setFormikValues] = useState(defaultFormikValues);

    const [disabled, setDisabled] = useState(false);

    const [agentMapByUuid, setAgentMapByUuid] = useState({});

    const [userInputError, setUserInputError] = useState(false);

    const [scripts, setScripts] = useState([]);

    const [scriptsMap, setScriptsMap] = useState({});

    // 本地文件如果还处于上传中，则禁止保存
    const checkStorageListAvailable = useCallback(e => {
        const {storageFileList = []} = e;
        const length = storageFileList?.length;

        let tempMap = {};
        for (let i = 0; i < length; i++) {
            const {sourcePath, sourceResourceName, status} = storageFileList[i];
            // 本地上传文件
            if (sourcePath === DEFAULT_STRING_VALUE) {
                if (status === LOADING.value) {
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

    const handleEditTargetServer = useCallback((agents, values, agentMap) => {
        setStepEditingValue({
            ...values,
            targetResourceList: agents,
        });
        setAgentMapByUuid(agentMap);
    }, [setStepEditingValue]);

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

    const getScriptsFromPipe = useCallback(async () => {
        let scriptList = [];
        // TODO 生产环境动态化
        // if (IS_PROD) {
        //     scriptList = await request({
        //         url: `${COMMON_URL_PREFIX}${GLOBAL_URLS.GET_SCRIPTS}`,
        //         params: {
        //             _offset: 0,
        //             _limit: 10,
        //             keyword: '',
        //         },
        //     });
        // } else {
            scriptList = TEMP_SCRIPTS;
        // }

        setScripts(scriptList);
        const tempMap = {};
        scriptList.forEach(item => {
            tempMap[item.id] = item;
        });
        setScriptsMap(tempMap);
    }, []);

    const handleChangeImportScript = useCallback(e => {
        const currentScript = scriptsMap[e];
        const updatedData = {
            chooseScript: e,
            scriptContents: currentScript?.script,
        };

        if (stepEditingValue) {
            setStepEditingValue({
                ...stepEditingValue,
                ...updatedData,
            });
        } else {
            setFormikValues({
                ...formikValues,
                ...updatedData,
            });
        }

    }, [formikValues, scriptsMap, setStepEditingValue, stepEditingValue]);

    useEffect(() => {
        getUsersFromOne();
    }, []);

    useEffect(() => {
        if (formikValues.type === STEP_TYPES.MANUAL_CONFIRM.value) {
            setFormikValues({
                ...formikValues,
                timeoutValue: 3,
            });
        }
    }, [formikValues.type]);

    // 切换脚本使用类型(兼容编辑和新建)
    useEffect(() => {
        const {value} = SCRIPTS_ORIGIN.IMPORT_SCRIPTS;
        if (formikValues.scriptOrigin === value || stepEditingValue?.scriptOrigin === value) {
            getScriptsFromPipe();
        }
    }, [formikValues.scriptOrigin, stepEditingValue?.scriptOrigin]);
    return {
        formikValues,
        setFormikValues,
        disabled,
        setDisabled,
        handleSubmit,
        handleCancel,
        handleChangeTargetServer,
        userInputError,
        setUserInputError,
        scripts,
        scriptsMap,
        handleChangeImportScript,
    };
};
export default useAddNoahStep;
