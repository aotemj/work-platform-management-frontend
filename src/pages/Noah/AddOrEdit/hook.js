import {useNavigate, useParams} from 'react-router-dom';
import {useCallback, useEffect, useMemo, useState} from 'react';
import {message, Modal} from '@osui/ui';
import {clone, isNil, omit, pickBy} from 'ramda';

import {getContainerDOM, getUrlPrefixReal} from '../../../utils';
import useCategory from './hooks/category';
import useGlobalVariable from './hooks/globalVariable';
import {request} from '../../../request/fetch';
import {URLS, UPDATE_FILE_STATUS, BOOLEAN_FROM_SERVER} from './constants';
import {
    DEFAULT_STRING_VALUE,
    DELETE_SYMBOL,
    REQUEST_CODE,
    REQUEST_METHODS,
    SPLIT_SYMBOL,
    STEP_TYPES,
    SYMBOL_FOR_ALL,
    COMMON_URL_PREFIX,
} from '../../../constant';
import {routes} from '../../../routes';
// import {omitBy} from 'lodash';

const defaultFormikValues = {
    id: null,
    // 方案名称
    name: '',
    // 分类
    category: [],
    // 作业描述
    noahDescribes: '',
    // 全局变量
    variable: [],
    // 作业步骤
    stageList: [],
};

const useAddOrEdit = executionDetail => {

    const params = useParams();
    const navigate = useNavigate();
    const urlParams = new URL(window.location.href);
    const {pathname} = urlParams;
    const stageId = useMemo(() => {
        return executionDetail?.stageTriggerList?.filter(item => item.id === Number(params?.stepId))[0]?.stageId;
    }, [executionDetail, params]);
    // 预执行
    const isExecuting = useMemo(() => {
        return pathname === routes.NOAH_PRE_EXECUTING.getUrl(params?.detailId);
    }, [params?.detailId, pathname]);

    // 预览模式（不允许编辑）
    const isViewing = useMemo(() => {
        const {detailId, stepId = null, executeId = null} = params;
        return pathname === routes.EXEC_LOG.getUrl(detailId, executeId, stepId);
        // return pathname.startsWith(routes.EXEC_LOG)
    }, [params, pathname]);

    // 编辑
    const [editing, setEditing] = useState(!isExecuting && !isViewing && !!params?.detailId);

    const [formikValues, setFormikValues] = useState(defaultFormikValues);

    const [disabled, setDisabled] = useState(false);

    const [globalVariableVisible, setGlobalVariableVisible] = useState(false);

    const [addStepDrawerVisible, setAddStepDrawerVisible] = useState(false);
    // const [addStepDrawerVisible, setAddStepDrawerVisible] = useState(true);

    // 编辑全局变量数据
    const [globalVariableEditingValue, setGlobalVariableEditingValue] = useState(null);

    const [stepEditingValue, setStepEditingValue] = useState(null);

    // 编辑或执行时拿到的单条数据
    const [detailFromServer, setDetailFromServer] = useState({});

    const title = useMemo(() => {
        if (isExecuting) {
            return `执行作业方案${detailFromServer?.sourceData?.workPlan?.name || DEFAULT_STRING_VALUE}`;
        } else if (editing) {
            return '编辑作业';
        }

        return '新建作业';

    }, [detailFromServer?.sourceData, editing, isExecuting, isViewing, stageId]);
    /**
     * 分类更新逻辑
     *  新增：
     *      * 如果是在服务端请求到的已存在的分类，则传递当前分类id 和名称
            *  * 如果是在页面上新增的分类，则只传递名称
     *  删除：
     *      * 某条记录之前选中的记录，如果删除了，需要把当前删除的分类 status 置为 -1 （正常为 0）
     */
    const addCategoryCallback = useCallback(({name}) => {
        const {category} = formikValues;
        setFormikValues({
            ...formikValues,
            category: [name, ...category],
        });
    }, [setFormikValues, formikValues]);

    const reset = useCallback(() => {
    }, []);

    const goBack = useCallback(() => {
        reset();
        navigate(`${getUrlPrefixReal()}/${routes.NOAH_LIST.url}`);
    }, [navigate, reset]);

    const goBackWithConfirm = useCallback(() => {
        Modal.confirm({
            title: `确定要取消${isExecuting ? '执行' : (editing ? '编辑' : '添加')}作业吗？`,
            getContainer: getContainerDOM,
            onOk: goBack,
        });
    }, [editing, goBack, isExecuting]);

    const {
        categories,
        categoryMap,
        handleSubmitAddCategory,
        addCategoryVisible,
        setAddCategoryVisible,
        fetchCategory,
    } = useCategory(addCategoryCallback);

    const handleChangeVariable = useCallback(variables => {
        setFormikValues({
            ...formikValues,
            variable: variables,
        });

        setGlobalVariableVisible(false);
    }, [formikValues]);

    const {
        globalVariables,
        handleRemoveGlobalVariable,
        handleChangeGlobalVariable,
        setGlobalsVariables,
        setVariableMap,
    } = useGlobalVariable({
        handleChangeVariable,
        setVisible: setGlobalVariableVisible,
        onClose: () => setGlobalVariableVisible(false),
        visible: globalVariableVisible,
        globalVariableEditingValue,
    });

    // 转换类型
    const convertAdditionCategories = useCallback(list => {
        const listMap = {};
        const tempList = list.map(item => {
            let tempObj = {};
            if (typeof item === 'number') {
                tempObj = {workGroup: {id: item}};
                listMap[item] = tempObj;
            } else {
                tempObj = {workGroup: {name: item}};
            }
            return tempObj;
        });
        return {
            listMap,
            tempList,
        };
    }, []);

    /**
     * list : 用户当前选中的分类列表
     */
    const convertEditCategories = useCallback(list => {
        // tempList 为添加的分类
        const {tempList, listMap} = convertAdditionCategories(list);

        // haveDeletedList 是已经删除的分类
        let haveDeletedList = [];

        if (detailFromServer) {
            const {sourceData} = detailFromServer;
            const {groupRelList} = sourceData?.workPlan;
            const length = groupRelList.length;
            for (let i = 0; i < length; i++) {
                const item = groupRelList[i];
                const {workGroup: {name, id}} = item;
                // 对比删掉的值，将其status置为 -1
                if (categoryMap[name] && !listMap[id]) {
                    haveDeletedList.push({
                        ...item,
                        workGroup: {
                            ...item.workGroup,
                            status: DELETE_SYMBOL,
                        },
                    });
                }
            }
        }

        return [...haveDeletedList, ...tempList];
    }, [categoryMap, convertAdditionCategories, detailFromServer]);

    const convertCategory = useCallback((category = []) => {

        const groupRelList = clone(category);

        if (category?.[0] === SYMBOL_FOR_ALL) {
            groupRelList.shift();
        }
        if (editing) {
            return convertEditCategories(groupRelList);
        }
        return convertAdditionCategories(groupRelList).tempList;
    }, [convertAdditionCategories, convertEditCategories, editing]);

    const coverStorageFileList = useCallback((originList = []) => {
        return originList.map(item => {
            let tempObj = pickBy(
                property => property !== DEFAULT_STRING_VALUE,
                pickBy(property => !isNil(property), item),
            );
            return omit(['status'], tempObj);
        });
    }, []);

    const convertedStageListStatus = useCallback(status => {
        if (status) {
            return UPDATE_FILE_STATUS.get(status).value;
        }
        return status;
    }, []);

    const convertStageList = useCallback(stageList => {
        return stageList.map((item, index) => {
            // runtimeEnv	运行环境 1：主机运行，2：容器运行		false   // integer
            // scriptContents	脚本内容		false   // string
            // scriptId	脚本管理平台数据ID		false   // integer
            // scriptLanguage	脚本语言：Groovy、Python、Linux Bash		false   // string
            // scriptParams	脚本参数,多个参数英文逗号分隔		false   // string
            // scriptType	脚本类型 1：脚本引用；2：手动录入		false   // integer
            // timeoutValue	超时时长(单位秒)		false   // integer
            const {
                id = null,
                status,
                // about script execution
                runningEnvironment: runtimeEnv,
                scriptContents,
                scriptParams,
                scriptLanguage,
                timeoutValue,
                scriptOrigin: scriptType,
                // 脚本管理平台ID
                chooseScript: scriptId,
                name,
                type,
                targetResourceList = [],

                // 文件分发 相关
                downloadLimit,
                targetPath,
                uploadLimit,
                transmissionMode,
                storageFileList = [],

                // 人工确认相关
                describes,
                informUserId,
                informWay,
            } = item;

            const tempStorageFileList = coverStorageFileList(storageFileList);
            const tempTargetResourceList = targetResourceList.map(item => {
                // id	ID		false   // integer
                // status	通用状态 0：正常；-1：删除；		false   // integer
                // targetResourceName	目标主机名		false   // string
                // targetUuid	目标主机标识		false   // string
                const {
                    uuid: targetUuid,
                    name: targetResourceName,
                    // status,
                } = item;
                return {
                    targetUuid,
                    targetResourceName,
                    // status,
                };
            });

            const {EXECUTE_SCRIPT, MANUAL_CONFIRM, FILE_DISTRIBUTION} = STEP_TYPES;

            const commonParams =  pickBy(property => !isNil(property), {
                id,
                type,
                name,
                sortIndex: index,
                status: convertedStageListStatus(status),
            });

            switch (type) {
                case EXECUTE_SCRIPT.value:
                    return {
                        ...commonParams,
                        stageScriptBean: {
                            runtimeEnv,
                            scriptContents,
                            scriptParams,
                            scriptLanguage,
                            timeoutValue,
                            scriptType,
                            scriptId,
                        },
                        targetResourceList: tempTargetResourceList,
                    };
                case MANUAL_CONFIRM.value:
                    return {
                        ...commonParams,
                        stageConfirmBean: {
                            // describes	通知描述		false   string
                            // informUserId	通知人员		false   integer
                            // informWay	通知方式 1：邮件；2：短信；3：微信；4：站内通知		false   integer
                            // timeoutValue	超时时长(单位为秒)		false   integer
                            describes,
                            informUserId: informUserId.join(SPLIT_SYMBOL),
                            informWay: informWay.join(SPLIT_SYMBOL),
                            timeoutValue,
                        },
                    };
                case FILE_DISTRIBUTION.value:
                    // downloadLimit	下载限速(单位为kb)		false   // integer
                    // targetPath	文件的绝对路径		false   // string
                    // timeoutValue	超时时长(单位为秒)		false   // integer
                    // uploadLimit	上传限速(单位为kb)		false   // integer
                    return {
                        ...commonParams,
                        stageFileBean: {
                            targetPath,
                            downloadLimit,
                            timeoutValue,
                            uploadLimit,
                            transmissionMode,
                        },
                        storageFileList: tempStorageFileList,
                        targetResourceList: tempTargetResourceList,
                    };
            }

        });
    }, [convertedStageListStatus, coverStorageFileList]);

    const convertWorkVariateList = useCallback(variables => {
        const {POSITIVE, NEGATIVE} = BOOLEAN_FROM_SERVER;
        return variables.map(item => {
            const {exeChange, exeRequired} = item;
            return {
                ...item,
                exeChange: exeChange ? POSITIVE : NEGATIVE,
                exeRequired: exeRequired ? POSITIVE : NEGATIVE,
            };
        });
    }, []);

    const convertParams = useCallback(originParams => {
        const {stageList: originStageList, category, name, noahDescribes, id} = originParams;
        const groupRelList = convertCategory(category);
        // 这里需要把用户删掉的stageList 也传递到server
        const stageList = convertStageList(originStageList);
        const workVariateList = convertWorkVariateList(globalVariables);

        return {
            stageList,
            workPlan: {
                id,
                groupRelList,
                name,
                describes: noahDescribes,
                workVariateList,
            },
        };
    }, [convertCategory, convertStageList, convertWorkVariateList, globalVariables]);

    const handleSubmit = useCallback(async e => {
        const params = convertParams(e);

        const {POST, PUT} = REQUEST_METHODS;
        const res = await request({
            url: `${COMMON_URL_PREFIX}${URLS.ADD_NOAH_WORK_PLAN}`,
            method: editing ? PUT : POST,
            params,
        });
        const {status} = res;
        if (!status) {
            message.success('操作成功');
            navigate(`${getUrlPrefixReal()}/${routes.NOAH_LIST.url}`);
        }
    }, [convertParams, editing, navigate]);

    const handleCancelOperate = useCallback(() => {
        Modal.info({
            title: '确定要取消操作吗？',
            onOk: goBack,
            getContainer: getContainerDOM,
        });
    }, [goBack]);

    // 新增分类， 分类不能重复
    const handleAddCategory = useCallback(values => {
        setFormikValues({
            ...formikValues,
            ...values,
        });
        setAddCategoryVisible(true);
    }, [formikValues, setAddCategoryVisible]);

    const handleAddGlobalVariable = useCallback(values => {
        setFormikValues({
            ...formikValues,
            ...values,
        });
        setGlobalVariableEditingValue(null);
        setGlobalVariableVisible(true);
    }, [formikValues]);

    const handleStartAddStep = useCallback(values => {
        setStepEditingValue(null);
        setFormikValues({
            ...formikValues,
            ...values,
        });
        setAddStepDrawerVisible(true);
    }, [formikValues]);

    // add step
    const handleAddStep = useCallback(e => {
        const {stageList} = formikValues;
        setFormikValues({
            ...formikValues,
            stageList: [...stageList, e],
        });

        setAddStepDrawerVisible(false);
    }, [formikValues]);

    // edit step
    const handleEditStep = useCallback((e, originData) => {
        const {index} = originData;

        const {stageList} = formikValues;
        const tempArr = clone(stageList);
        tempArr[index] = e;
        setFormikValues({
            ...formikValues,
            stageList: tempArr,
        });

        setAddStepDrawerVisible(false);
    }, [formikValues]);

    // 更新步骤
    const handleChangeStep =  useCallback((e, stepEditingValue) => {
        const key = Date.now();
        const tempValue = {
            ...e,
            key, // react 循环  key
            index: formikValues.stageList.length,
        };
        if (stepEditingValue) {
            handleEditStep(e, stepEditingValue);
        } else {
            handleAddStep(tempValue);
        }
    }, [formikValues.stageList.length, handleAddStep, handleEditStep]);

    const handleRemoveStageList =  useCallback((e, stage) => {
        e.stopPropagation();
        const {stageList} = formikValues;
        const {index} = stage;
        const tempArr = clone(stageList);
        tempArr[index] = {
            ...stage,
            status: DELETE_SYMBOL,
        };

        setFormikValues({
            ...formikValues,
            stageList: tempArr,
        });
    }, [formikValues]);

    // 全局变量编辑
    const handleStartEditVariable = useCallback(e => {
        setGlobalVariableEditingValue(e);
        setGlobalVariableVisible(true);
    }, []);

    // 作业平台 编辑
    const handleStartEditStep = useCallback((e, stage) => {
        setStepEditingValue(stage);
        setAddStepDrawerVisible(true);
    }, []);

    const deConvertedTargetResourceList = useCallback(list => {
        return list.map(item => {
            const {
                // id,
                // stageId,
                targetUuid,
                targetResourceName,
                // groupName,
                // groupType,
                // tenant,
                // userId,
                // updateTime,
                // status,
            } = item;
            return {
                ...item,
                uuid: targetUuid,
                value: targetUuid,
                key: targetUuid,
                name: targetResourceName,
                title: targetResourceName,
            };
        });
    }, []);

    const deConvertedStorageFileList = useCallback(list => {
        return list.map((item, index) => {
            const {
            //     id,
            //     stageId,
            //     fileSource,
            //     sourceUuid,
                sourceResourceName = DEFAULT_STRING_VALUE,
                sourcePath = DEFAULT_STRING_VALUE,
            //     fileName,
            //     storageFilePath,
            //     storageFileUrl,
            //     storageId,
            //     fileMd5,
            //     fileSize,
            //     userId,
            //     createTime,
            //     updateTime,
            //     groupName,
            //     groupType,
            //     tenant,
            //     status,
            } = item;
            return {
                ...item,
                // id,
                key: index,
                sourcePath,
                // fileSource,
                sourceResourceName,
            };
        });
    }, []);

    const deConvertedStageFileBean = useCallback(tempObj => {
        const {
            transmissionMode,
            timeoutValue,
            uploadLimit,
            downloadLimit,
            targetPath,
        } = tempObj;

        return tempObj;
    }, []);

    const deConvertedStageListStatus = useCallback(status => {
        return UPDATE_FILE_STATUS.get(status).label;
    }, []);

    const deConvertStageList = useCallback(list => {
        // type,
        // name,
        // runningEnvironment,
        // scriptOrigin,
        // chooseScript,
        // scriptContents,
        // targetResourceList,
        // scriptLanguage,
        // scriptParams,
        // timeoutValue,
        // uploadLimitDisabled,
        // uploadLimit,
        // downloadLimitDisabled,
        // downloadLimit,
        const {EXECUTE_SCRIPT, MANUAL_CONFIRM, FILE_DISTRIBUTION} = STEP_TYPES;

        return list.map(item => {
            const {
                id,
                name,
                type,
                sortIndex,
                openStatus,
                stageFileBean,
                stageConfirmBean,
                status,
                stageScriptBean,
                storageFileList,
                targetResourceList,
                describes = '',
            } = item;

            const convertedStorageFileList = deConvertedStorageFileList(storageFileList);

            const convertedTargetResourceList = deConvertedTargetResourceList(targetResourceList);

            const commonParams = {
                id,
                type,
                name,
                describes,
                index: sortIndex - 1,
                openStatus,
                // index: sortIndex,
            };

            switch (type) {
                case EXECUTE_SCRIPT.value:
                    const {
                        scriptId,
                        scriptType,
                        scriptLanguage,
                        scriptContents,
                        scriptParams,
                        timeoutValue,
                        runtimeEnv,
                    } = stageScriptBean;
                    return {
                        ...commonParams,
                        runningEnvironment: runtimeEnv,
                        scriptOrigin: scriptType,
                        scriptContents,
                        scriptParams,
                        scriptLanguage,
                        timeoutValue,
                        scriptType,
                        chooseScript: scriptId,
                        targetResourceList: convertedTargetResourceList,
                    };
                case MANUAL_CONFIRM.value:
                {
                    const {
                        timeoutValue,
                        informUserId,
                        informWay,
                        describes,
                    } = stageConfirmBean;
                    return {
                        ...commonParams,
                        describes,
                        informUserId: informUserId?.split(SPLIT_SYMBOL),
                        informWay: informWay?.split(SPLIT_SYMBOL).map(item => Number(item)),
                        timeoutValue,
                        status: deConvertedStageListStatus(status),
                    };
                }
                case FILE_DISTRIBUTION.value:
                {
                    const convertedStageFileBean = deConvertedStageFileBean(stageFileBean);

                    const {
                        transmissionMode,
                        timeoutValue,
                        uploadLimit,
                        downloadLimit,
                        targetPath,
                    } = convertedStageFileBean;
                    return {
                        ...commonParams,
                        transmissionMode,
                        timeoutValue,
                        uploadLimitDisabled: !uploadLimit,
                        downloadLimitDisabled: !downloadLimit,
                        uploadLimit,
                        downloadLimit,
                        targetPath,
                        storageFileList: convertedStorageFileList,
                        targetResourceList: convertedTargetResourceList,
                    };
                }
            }
        });
    }, [
        deConvertedStageFileBean,
        deConvertedStageListStatus,
        deConvertedStorageFileList,
        deConvertedTargetResourceList,
    ]);

    // 作业分类列表
    const deConvertedGroupRelList = useCallback(list => {
        return list.map(item => {
            const {
                // id,
                workGroup: {
                    id,
                    // name
                }} = item;
            return id;
        });
    }, []);

    const deConvertWorkVariateList = useCallback(list => {
        // type
        // name
        // value
        // describes
        // exeChange
        // exeRequired
        // index
        const tempMap = {};
        const tempList = list.map((item, index) => {
            const {
            //     id,
                name,
            //     value,
            //     type,
            //     exeChange,
            //     exeRequired,
            //     describes,
            //     status,
            } = item;
            const tempItem = {
                ...item,
                index,
            };
            tempMap[name] = tempItem;
            return tempItem;
        });

        setGlobalsVariables(tempList);

        setVariableMap(tempMap);
        return tempList;
    }, [setGlobalsVariables, setVariableMap]);

    const deConvertWorkPlan = useCallback(workPlan => {
        const {
            id,
            name,
            describes,
            useTemp,
            // typeNames, // '123123,123123123'
            status,
            groupRelList,
            workVariateList,
        } = workPlan;
        const convertedGroupRelList = deConvertedGroupRelList(groupRelList);
        const convertedWorkVariateList = deConvertWorkVariateList(workVariateList);

        return {
            name,
            id,
            noahDescribes: describes,
            category: convertedGroupRelList,
            // status
            variable: convertedWorkVariateList,
        };
    }, [deConvertWorkVariateList, deConvertedGroupRelList]);

    const deConvertParams = useCallback(data => {
        const {stageList, workPlan} = data;
        const convertedStageList = deConvertStageList(stageList);
        const convertedWorkPlan = deConvertWorkPlan(workPlan);
        return {
            ...convertedWorkPlan,
            stageList: convertedStageList,
        };
    }, [deConvertStageList, deConvertWorkPlan]);

    const handleSourceCategoryMap = useCallback(data => {
        const tempMap = {};
        if (data) {
            const {
                workPlan: {
                    groupRelList,
                },
            } = data;
            groupRelList.forEach(item => {
                const {workGroup: {id}} = item;
                tempMap[id] = item;
            });
        }
        return tempMap;
    }, []);

    const getNoahDetail = useCallback(async () => {
        const {detailId} = params;
        const res = await request({
            url: `${COMMON_URL_PREFIX}${URLS.ADD_NOAH_WORK_PLAN}${detailId}`,
        });
        const {code, data} = res;
        if (code === REQUEST_CODE.SUCCESS) {
            const convertedValues = deConvertParams(data);
            setFormikValues(convertedValues);
            // 查看模式赋值(不允许修改)
            if (isViewing) {
                const currentStage = convertedValues?.stageList?.filter(item => item.id === stageId)[0];
                setStepEditingValue(currentStage);
            }
            setDetailFromServer({
                sourceData: data,
                formattedFromFront: convertedValues,
                sourceCategoryMap: handleSourceCategoryMap(data),
            });
        }
    }, [deConvertParams, handleSourceCategoryMap, isViewing, params, stageId]);

    // 执行相关
    const handleExecute = useCallback(async () => {
        const res = await request({
            url: `${COMMON_URL_PREFIX}${URLS.INDIVIDUAL_EXECUTE}${params?.detailId}`,
            method: REQUEST_METHODS.POST,
        });
        const {code, data} = res;
        if (code === REQUEST_CODE.SUCCESS) {
            message.success('操作成功');

            navigate(`${getUrlPrefixReal()}/${routes.EXEC_LIST.url}?id=${data?.id}`);
        }
    }, [navigate, params?.detailId]);

    useEffect(() => {
        fetchCategory();
    }, []);

    // 获取编辑详情
    useEffect(() => {
        if (!params?.detailId || (isViewing && !stageId)) {
            return;
        }
        getNoahDetail();
    }, [params?.detailId, getNoahDetail]);

    return {
        title,
        goBack,
        goBackWithConfirm,
        categories,
        setDisabled,
        handleSubmit,
        disabled,
        formikValues,
        handleCancelOperate,
        handleRemoveStageList,
        editing,
        isExecuting,

        // about category
        handleAddCategory,
        setAddCategoryVisible,
        addCategoryVisible,
        handleSubmitAddCategory,

        // about variable
        handleAddGlobalVariable,
        globalVariables,
        handleRemoveGlobalVariable,
        globalVariableVisible,
        setGlobalVariableVisible,
        handleChangeGlobalVariable,
        handleStartEditVariable,
        globalVariableEditingValue,

        // about step
        addStepDrawerVisible,
        setAddStepDrawerVisible,
        handleStartAddStep,
        handleChangeStep,
        handleStartEditStep,
        stepEditingValue,
        setStepEditingValue,

        // about execution
        handleExecute,
    };
};

export default useAddOrEdit;



