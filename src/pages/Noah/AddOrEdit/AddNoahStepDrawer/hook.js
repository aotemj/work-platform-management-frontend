import {useCallback, useEffect, useState} from 'react';
import {Modal} from '@osui/ui';
import {omit} from 'ramda';
import {useDispatch} from 'react-redux';

import {assembleExternalUrl, debounceWith250ms, getContainerDOM, Toast} from '../../../../utils';
import {
    SCRIPTS_ORIGIN,
    LOADING,
    defaultFormikValues,
} from '../constants';
import {
    DEFAULT_STRING_VALUE,
    STEP_TYPES,
    IS_PROD,
    DEFAULT_PAGINATION,
    TYPES_OF_FETCHING,
} from '../../../../constant';
import {request} from '../../../../request/fetch';
import {GLOBAL_URLS} from '../../../../constant/index';
import {TEMP_SCRIPTS} from '../../../../temp/scripts';
import {updateLocalFile, updateServerFile} from '../../../../reduxSlice/fileUpload/uploadDetailSlice';

const useAddNoahStep = ({
    onClose,
    handleChangeStep,
    stepEditingValue,
    setStepEditingValue,
    updateUserFromOne,
    visible,
}) => {
    const dispatch = useDispatch();
    const updateLocalFileMap = item => dispatch(updateLocalFile(item));
    const updateServerFileMap = item => dispatch(updateServerFile(item));

    const [formikValues, setFormikValues] = useState(defaultFormikValues);
    const [disabled, setDisabled] = useState(false);

    const [userInputError, setUserInputError] = useState(false);

    const [scripts, setScripts] = useState([]);

    const [scriptsMap, setScriptsMap] = useState({});

    const [searchUserName, setSearchUserName] = useState('');

    const [searchScriptName, setSearchScriptName] = useState('');

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
                    Toast.error('当前有本地文件未上传完成，请等待上传成功后保存');
                    return false;
                }
                continue;

            }

            // 服务器文件
            if (tempMap[`${sourcePath}${DEFAULT_STRING_VALUE}${sourceResourceName}`]) {
                Toast.error('请勿填写一台主机上的相同路径');
                return false;
            }
            tempMap[`${sourcePath}${DEFAULT_STRING_VALUE}${sourceResourceName}`] = 1;
        }
        return true;

    }, []);

    const handleSubmit = debounceWith250ms((e, stepEditingValue) => {
        const available = checkStorageListAvailable(e);

        if (!available) {
            setUserInputError(true);
            return false;
        }

        setUserInputError(false);
        handleChangeStep(e, stepEditingValue);
        setFormikValues(defaultFormikValues);
    });

    const handleCancel = useCallback(() => {
        Modal.confirm({
            title: '确定要取消当前操作吗？',
            getContainer: getContainerDOM,
            onOk: () => {
                // 重置表单
                setFormikValues(defaultFormikValues);
                onClose();
            },
        });
    }, [onClose]);

    const handleEditTargetServer = useCallback((agents, values) => {
        setStepEditingValue({
            ...values,
            targetResourceList: agents,
        });
    }, [setStepEditingValue]);

    const handleAddTargetServer = useCallback((agents, values) => {
        setFormikValues({
            ...values,
            targetResourceList: agents,
        });
    }, []);

    const handleChangeTargetServer = useCallback(({agents, values, editing}) => {
        if (editing) {
            handleEditTargetServer(agents, values);
        } else {
            handleAddTargetServer(agents, values);
        }
    }, [handleAddTargetServer, handleEditTargetServer]);

    const getScriptsFromPipe = async (payload = {}) => {
        const {INIT, MORE} = TYPES_OF_FETCHING;
        const {currentPage = 0, type = INIT} = payload;
        let scriptObj;
        let scriptList;
        if (IS_PROD) {
            const {pageSize} = DEFAULT_PAGINATION;
            scriptObj = await request({
                url: assembleExternalUrl(GLOBAL_URLS.GET_SCRIPTS),
                params: {
                    _offset: currentPage * pageSize,
                    _limit: pageSize,
                    keyword: searchScriptName,
                },
            });
            scriptObj = omit(['status', 'msg'], scriptObj);
            scriptObj.length = Object.keys(scriptObj).length;
            const newScripts = Array.from(scriptObj);
            if (type === MORE) {
                scriptList = [...scripts, newScripts];
            } else {
                scriptList = newScripts;
            }
        } else {
            scriptList = TEMP_SCRIPTS;
        }

        setScripts(scriptList);
        const tempMap = {};
        scriptList.forEach(item => {
            tempMap[item.id] = item;
        });
        setScriptsMap(tempMap);
    };

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

    const handleSearchInformUser = debounceWith250ms(e => {
        setSearchUserName(e);
    });

    const handleSearchScript = debounceWith250ms(e => {
        setSearchScriptName(e);
    });

    useEffect(() => {
        const {value} = STEP_TYPES.MANUAL_CONFIRM;
        if (visible) {
            if ((stepEditingValue?.type === value || formikValues.type === value)) {
                updateUserFromOne({});
            }
        } else {
            setFormikValues(defaultFormikValues);
            updateServerFileMap({key: ''});
            updateLocalFileMap({key: ''});
        }
    }, [visible, stepEditingValue?.type, formikValues.type]);

    useEffect(() => {
        updateUserFromOne({
            currentPage: 0,
            name: searchUserName,
        });
    }, [searchUserName]);

    // 切换脚本使用类型(兼容编辑和新建)
    useEffect(() => {
        const {value} = SCRIPTS_ORIGIN.IMPORT_SCRIPTS;
        if (formikValues.scriptOrigin === value || stepEditingValue?.scriptOrigin === value) {
            getScriptsFromPipe({});
        }
    }, [formikValues.scriptOrigin, stepEditingValue?.scriptOrigin]);

    useEffect(() => {
        getScriptsFromPipe({
            currentPage: 0,
        });
    }, [searchScriptName]);

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
        handleSearchInformUser,
        handleSearchScript,
        searchScriptName,
    };
};
export default useAddNoahStep;
