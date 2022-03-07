import {useNavigate, useParams} from 'react-router-dom';
import {useCallback, useEffect, useState} from 'react';
import {message, Modal} from '@osui/ui';
import {clone, isNil, omit, pickBy} from 'ramda';

import {getContainerDOM} from '../../../utils';
import useCategory from './hooks/category';
import useGlobalVariable from './hooks/globalVariable';
import {request} from '../../../request/fetch';
import {URL_PREFIX1, URL, STEP_TYPES} from './constants';
import {DEFAULT_STRING_VALUE, REQUEST_METHODS, SYMBOL_FOR_ALL} from '../../../constant';

const defaultFormikValues = {
    // 方案名称
    name: '',
    // 分类
    category: [],
    // 作业描述
    describes: '',
    // 全局变量
    variable: [],
    // 作业步骤
    stageList: [],
    // step: [{}],
};

// 添加
const handleAdd = () => {
    const title = '新建作业';
    return {
        title,
    };
};

// 编辑
const handleEdit = () => {
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
    }, [navigate]);
    // 编辑
    const [editing, setEditing] = useState(true);

    const [formikValues, setFormikValues] = useState(defaultFormikValues);

    const [disabled, setDisabled] = useState(false);

    const [globalVariableVisible, setGlobalVariableVisible] = useState(false);

    // const [addStepDrawerVisible, setAddStepDrawerVisible] = useState(false);
    const [addStepDrawerVisible, setAddStepDrawerVisible] = useState(true);

    // 编辑全局变量数据
    const [globalVariableEditingValue, setGlobalVariableEditingValue] = useState(null);

    const [stepEditingValue, setStepEditingValue] = useState(null);

    const addCategoryCallback = useCallback(({name}) => {
        const {category} = formikValues;
        setFormikValues({
            ...formikValues,
            category: [name, ...category],
        });
    }, [setFormikValues, formikValues]);
    const {
        categories,
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
    } = useGlobalVariable({
        editing: Boolean(globalVariableEditingValue),
        handleChangeVariable,
    });

    const convertCategory = useCallback(category => {
        const groupRelList = clone(category);

        if (category?.[0] === SYMBOL_FOR_ALL) {
            groupRelList.shift();
        }

        return groupRelList.map(item => {
            if (typeof item === 'number') {
                return {workGroup: {id: item}};
            }
            return {workGroup: {name: item}};


        });
    }, []);

    const coverStorageFileList = useCallback(originList => {
        return originList.map(item => {
            let tempObj = pickBy(
                property => property !== DEFAULT_STRING_VALUE,
                pickBy(property => !isNil(property), item),
            );
            return omit(['status'], tempObj);
        });
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
                // about script execution
                runningEnvironment: runtimeEnv,
                scriptContents,
                scriptParams,
                scriptLanguage,
                timeoutValue,
                scriptOrigin: scriptType,
                name,
                type,
                targetResourceList,


                downloadLimit,
                targetPath,
                uploadLimit,
                transmissionMode,
                storageFileList,
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

            switch (type) {
                case EXECUTE_SCRIPT.value:
                    return {
                        type,
                        name,
                        sortIndex: index,
                        stageScriptBean: {
                            runtimeEnv,
                            scriptContents,
                            scriptParams,
                            scriptLanguage,
                            timeoutValue,
                            scriptType,
                        },
                        targetResourceList: tempTargetResourceList,
                    };
                case MANUAL_CONFIRM.value:
                    break;
                case FILE_DISTRIBUTION.value:
                    // downloadLimit	下载限速(单位为kb)		false   // integer
                    // targetPath	文件的绝对路径		false   // string
                    // timeoutValue	超时时长(单位为秒)		false   // integer
                    // uploadLimit	上传限速(单位为kb)		false   // integer
                    return {
                        type,
                        name,
                        sortIndex: index,
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
    }, [coverStorageFileList]);

    const convertWorkVariateList = useCallback(variables => {
        return variables.map(item => {
            const {exeChange, exeRequired} = item;
            return {
                ...item,
                exeChange: exeChange ? 1 : 0,
                exeRequired: exeRequired ? 1 : 0,
            };
        });
    }, []);

    const convertParams = useCallback(originParams => {
        const {stageList: originStageList, category, name, describes, variable} = originParams;

        const groupRelList = convertCategory(category);
        const stageList = convertStageList(originStageList);
        const workVariateList = convertWorkVariateList(variable);

        return {
            stageList,
            workPlan: {
                groupRelList,
                name,
                describes,
                workVariateList,
            },
        };
    }, [convertCategory, convertStageList, convertWorkVariateList]);

    const handleSubmit = useCallback(async e => {
        const params = convertParams(e);

        const res = await request({
            url: `${URL_PREFIX1}${URL.ADD_NOAH_WORK_PLAN}`,
            method: REQUEST_METHODS.POST,
            params,
        });
        const {status} = res;
        if (!status) {
            message.success('添加成功');
            // goBack();
        //     TODO reset form;
        }
    }, [convertParams]);

    const handleCancelOperate = useCallback(() => {
        Modal.info({
            title: '确定要取消操作吗？',
            onOk: goBack,
            getContainer: getContainerDOM,
        });
    }, [goBack]);

    const handleAddCategory = useCallback(values => {
        setFormikValues({
            ...formikValues,
            ...values,
        });
        setAddCategoryVisible(true);
    }, [formikValues, setAddCategoryVisible]);

    const handleAddGlobalVariable = useCallback(() => {
        setGlobalVariableEditingValue(null);
        setGlobalVariableVisible(true);
    }, []);

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
            stageList: [...stageList, {...e, sortIndex: stageList.length}],
        });

        setAddStepDrawerVisible(false);
    }, [formikValues]);

    // edit step
    const handleEditStep = useCallback((e, originData) => {
        const {sortIndex} = originData;

        const {stageList} = formikValues;
        const tempArr = clone(stageList);
        tempArr[sortIndex] = e;
        setFormikValues({
            ...formikValues,
            stageList: tempArr,
        });

        setAddStepDrawerVisible(false);
    }, [formikValues]);

    // 新建步骤
    const handleChangeStep =  useCallback((e, stepEditingValue) => {
        if (stepEditingValue) {
            handleEditStep(e, stepEditingValue);
        } else {
            handleAddStep(e);
        }
    }, [handleAddStep, handleEditStep]);

    const handleRemoveStageList =  useCallback(e => {
        const {stageList} = formikValues;
        const {index} = e;
        const tempArr = clone(stageList);
        tempArr.splice(index, 1);
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
    const handleStartEditStep = useCallback(e => {
        setStepEditingValue(e);
        setAddStepDrawerVisible(true);
    }, []);

    useEffect(() => {
        fetchCategory();
    }, []);

    const common = {
        goBack,
        categories,
        setDisabled,
        handleSubmit,
        disabled,
        formikValues,
        handleCancelOperate,
        handleRemoveStageList,
        editing,

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
    };

    if (params?.detailId) {
        setEditing(true);

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


