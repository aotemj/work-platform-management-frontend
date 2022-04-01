import {useNavigate, useParams} from 'react-router-dom';
import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {message, Modal} from '@osui/ui';
import {clone, isNil, omit, pickBy, prop} from 'ramda';

import {getContainerDOM, getUrlPrefixReal} from '../../../utils';
import useGlobalVariable from './hooks/globalVariable';
import {request} from '../../../request/fetch';
import {URLS, UPDATE_FILE_STATUS, BOOLEAN_FROM_SERVER, ERROR_MSG} from './constants';
import {
    DEFAULT_STRING_VALUE,
    DELETE_SYMBOL,
    REQUEST_CODE,
    REQUEST_METHODS,
    SPLIT_SYMBOL,
    STEP_TYPES,
    SYMBOL_FOR_ALL,
    COMMON_URL_PREFIX,
    MINUTE_STEP,
    MAGE_BYTE_SCALE,
} from '../../../constant';
import {routes} from '../../../routes';
import {deConvertParams} from '../../../utils/convertNoahDetail';
import {debounce} from 'lodash/fp';

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

const useAddOrEdit = ({
    executionDetail,
    getNoahWorkPlanDetail,
    noahDetail,
    categories,
    categoryMap,
    getCategoryList,
    updateCategory,
    updateNoahDetail,
}) => {
    const params = useParams();
    const navigate = useNavigate();
    const urlParams = new URL(window.location.href);
    const {pathname} = urlParams;
    const [addCategoryVisible, setAddCategoryVisible] = useState(false);
    let formRef = useRef();

    const stageId = useMemo(() => {
        return executionDetail
            ?.stageTriggerList
            ?.filter(item => item.id === Number(prop('stepId', params)))[0]
            ?.stageId;
    }, [executionDetail, params]);
    // 预执行
    const isExecuting = useMemo(() => {
        return pathname === routes.NOAH_PRE_EXECUTING.getUrl(prop('detailId', params));
    }, [params, pathname]);

    // 预览模式（不允许编辑）
    const isViewing = useMemo(() => {
        const {detailId, stepId = null, executeId = null} = params;
        return pathname === routes.EXEC_LOG.getUrl(detailId, executeId, stepId);
    }, [params, pathname]);

    // 编辑
    const editing = useMemo(() => !isExecuting && !isViewing && !!prop('detailId', params),
        [isExecuting, isViewing, params]);

    const [formikValues, setFormikValues] = useState(defaultFormikValues);

    const [disabled, setDisabled] = useState(false);

    const [globalVariableVisible, setGlobalVariableVisible] = useState(false);

    const [addStepDrawerVisible, setAddStepDrawerVisible] = useState(false);

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

    }, [detailFromServer?.sourceData, editing, isExecuting]);
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

    const reset = () => {
        setFormikValues(defaultFormikValues);
        setStepEditingValue(null);
    };

    const goBack = useCallback(() => {
        reset();
        navigate(`${getUrlPrefixReal()}/${routes.NOAH_LIST.url}`);
    }, [navigate]);

    const goBackWithConfirm = useCallback(() => {
        reset();
        Modal.confirm({
            title: `确定要取消${isExecuting ? '执行' : (editing ? '编辑' : '添加')}作业吗？`,
            getContainer: getContainerDOM,
            onOk: goBack,
        });
    }, [editing, goBack, isExecuting]);

    // 新增分类不进行入库操作，只在前端做暂存
    const handleSubmitAddCategory = useCallback(({name}) => {
        if (categoryMap[name]) {
            message.error(ERROR_MSG.CATEGORY_ALREADY_EXIST);
            return false;
        }

        const id = Date.now();
        const newCategory = {
            name,
            id,
        };
        updateCategory({
            categories: {
                list: [newCategory, ...categories],
                map: {
                    ...categoryMap,
                    [name]: newCategory,
                },
            },
        });
        message.success('添加成功');
        addCategoryCallback({name, id});
        return true;
    }, [categoryMap, updateCategory, categories, addCategoryCallback]);

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
            let tempObj;
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

    const convertStorageFileList = useCallback((originList = []) => {
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

    const convertTimeoutValue = useCallback(timeoutValue => {
        return timeoutValue * Math.pow(MINUTE_STEP, 2);
    }, []);

    // Mb -> Kb
    const convertFileSize = useCallback(size => {
        return size * MAGE_BYTE_SCALE;
    }, []);

    const convertStageList = useCallback(stageList => {
        return stageList.map((item, index) => {
            // runtimeEnv	运行环境 1：主机运行，2：容器运行		false   // integer
            // scriptContents	脚本内容		false   // string
            // scriptId	脚本管理平台数据ID		false   // integer
            // scriptLanguage	脚本语言：Groovy、Python、Linux Bash		false   // string
            // scriptParams	脚本参数,多个参数英文逗号分隔		false   // string
            // scriptType	脚本类型 1：脚本引用；2：手动录入		false   // integer
            // timeoutValue	超时时长(单位秒)		false   // integer 这里需要注意，前端的展示代为为小时，这里需要转换一下时间
            const {
                id = null,
                status,
                // about script execution
                runningEnvironment: runtimeEnv,
                scriptContents,
                scriptParams,
                scriptLanguage,
                // 超时时间
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

            const tempStorageFileList = convertStorageFileList(storageFileList);
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

            const commonParams = pickBy(property => !isNil(property), {
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
                            timeoutValue: convertTimeoutValue(timeoutValue),
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
                            downloadLimit: convertFileSize(downloadLimit),
                            timeoutValue,
                            uploadLimit: convertFileSize(uploadLimit),
                            transmissionMode,
                        },
                        storageFileList: tempStorageFileList,
                        targetResourceList: tempTargetResourceList,
                    };
            }

        });
    }, [convertedStageListStatus, convertStorageFileList]);

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

    const handleSubmit = debounce(500)(async e => {
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
    });

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
    const handleChangeStep = useCallback((e, stepEditingValue) => {
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

    const handleRemoveStageList = useCallback((e, stage) => {
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
        await getNoahWorkPlanDetail(detailId);
    }, [getNoahWorkPlanDetail, params]);

    // 执行相关
    const handleExecute = useCallback(async () => {
        const res = await request({
            url: `${COMMON_URL_PREFIX}${URLS.INDIVIDUAL_EXECUTE}${prop('detailId', params)}`,
            method: REQUEST_METHODS.POST,
        });
        const {code, data} = res;
        if (code === REQUEST_CODE.SUCCESS) {
            message.success('操作成功');

            navigate(`${getUrlPrefixReal()}/${routes.EXEC_LIST.url}?id=${data?.id}`);
        }
    }, [navigate, params]);

    useEffect(() => {
        if (noahDetail) {
            const {
                tempList,
                tempMap,
                tempParams,
            } = deConvertParams(noahDetail);
            setGlobalsVariables(tempList);
            setVariableMap(tempMap);
            setFormikValues(tempParams);
            // 查看模式赋值(不允许修改)
            if (isViewing) {
                const currentStage = tempParams?.stageList?.filter(item => item.id === stageId)[0];
                setStepEditingValue(currentStage);
            }
            setDetailFromServer({
                sourceData: noahDetail,
                formattedFromFront: tempParams,
                sourceCategoryMap: handleSourceCategoryMap(noahDetail),
            });
        }
    }, [noahDetail]);

    // initial
    useEffect(() => {
        getCategoryList();
        return () => {
            updateNoahDetail(null);
        };
    }, []);

    // 获取编辑详情
    useEffect(() => {
        if (!prop('detailId', params) || (isViewing && !stageId)) {
            return;
        }
        getNoahDetail();
    }, [params, getNoahDetail]);

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
        formRef,


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
