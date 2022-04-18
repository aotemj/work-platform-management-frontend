import {propOr} from 'ramda';

import {DEFAULT_STRING_VALUE, MAGE_BYTE_SCALE, MINUTE_STEP, SPLIT_SYMBOL, STEP_TYPES} from '../constant';
import {UPDATE_FILE_STATUS} from '../pages/Noah/AddOrEdit/constants';

// about convert
export const deConvertedTargetResourceList = list => {
    return list.map(item => {
        const {
            targetUuid,
            targetResourceName,
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
};
// second -> hour
const deConvertTimeoutValue = timeoutValue => {
    return timeoutValue / Math.pow(MINUTE_STEP, 2);
};

// Kb -> Mb
const deConvertFileSize = size => {
    return size / MAGE_BYTE_SCALE;
};

const deConvertedStorageFileList = list => {
    return list.map((item, index) => {
        return {
            ...item,
            key: index,
            sourcePath: propOr(DEFAULT_STRING_VALUE, 'sourcePath', item),
            sourceResourceName: propOr(DEFAULT_STRING_VALUE, 'sourceResourceName', item),
        };
    });
};

const deConvertedStageListStatus = status => {
    return UPDATE_FILE_STATUS.get(status).label;
};

// 作业分类列表
const deConvertedGroupRelList = list => {
    return list.map(item => {
        const {
            // id,
            workGroup: {
                id,
            },
        } = item;
        return id;
    });
};

const deConvertWorkVariateList = list => {
    const tempMap = {};
    const tempList = list.map((item, index) => {
        const {
            name,
        } = item;
        const tempItem = {
            ...item,
            index,
        };
        tempMap[name] = tempItem;
        return tempItem;
    });

    return {
        tempList,
        tempMap,
    };
};

const deConvertStageList = list => {
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
                    timeoutValueForExecuteScript: timeoutValue,
                    scriptType,
                    chooseScript: scriptId,
                    targetResourceList: convertedTargetResourceList,
                };
            case MANUAL_CONFIRM.value: {
                const {
                    timeoutValue: originalTimeoutValue,
                    informUserId,
                    informWay,
                    describes,
                } = stageConfirmBean;
                const timeoutValue = deConvertTimeoutValue(originalTimeoutValue);

                return {
                    ...commonParams,
                    describes,
                    informUserId: informUserId?.split(SPLIT_SYMBOL),
                    informWay: informWay?.split(SPLIT_SYMBOL).map(item => Number(item)),
                    timeoutValueForManualConfirm: timeoutValue,
                    status: deConvertedStageListStatus(status),
                };
            }
            case FILE_DISTRIBUTION.value: {

                const {
                    transmissionMode,
                    uploadLimit,
                    downloadLimit,
                    targetPath,
                    timeoutValue,
                } = stageFileBean;
                return {
                    ...commonParams,
                    transmissionMode,
                    timeoutValueForFileDistribution: timeoutValue,
                    uploadLimitDisabled: !uploadLimit,
                    downloadLimitDisabled: !downloadLimit,
                    uploadLimit: deConvertFileSize(uploadLimit),
                    downloadLimit: deConvertFileSize(downloadLimit),
                    targetPath,
                    storageFileList: convertedStorageFileList,
                    targetResourceList: convertedTargetResourceList,
                };
            }
        }
    });
};

const deConvertWorkPlan = workPlan => {
    const {
        id,
        name,
        describes,
        groupRelList,
        workVariateList,
    } = workPlan;
    const convertedGroupRelList = deConvertedGroupRelList(groupRelList);
    const {tempList, tempMap} = deConvertWorkVariateList(workVariateList);

    return {
        tempWorkPlan: {
            name,
            id,
            noahDescribes: describes,
            category: convertedGroupRelList,
            variable: tempList,
        },
        tempList,
        tempMap,
    };
};

export const deConvertParams = data => {
    const {stageList, workPlan} = data;
    const convertedStageList = deConvertStageList(stageList);
    const {
        tempWorkPlan,
        tempMap,
        tempList,
    } = deConvertWorkPlan(workPlan);

    return {
        tempParams: {
            ...tempWorkPlan,
            stageList: convertedStageList,
        },
        tempMap,
        tempList,
    };
};

/**
 * 当前方法为转换日志显示详情页的作业详情快照，数据是从后端的执行详情里转换成前端使用的表单数据，比较复杂，而且没什么意义，纯粹是为了匹配后端的字段，不熟悉勿动！
 */
export const deConvertDataFromExecutionDetail = originData => {
    const {
        name,
        sortIndex,
        stageTriggerItemList,
        type,
        describes,
    } = originData;

    const {EXECUTE_SCRIPT, FILE_DISTRIBUTION} = STEP_TYPES;
    const commonParams = {
        type,
        name,
        describes,
        index: sortIndex - 1,
    };
    switch (type) {
        case EXECUTE_SCRIPT.value:
        {
            const {
                stageScript: {
                    runtimeEnv: runningEnvironment,
                    scriptContents,
                    scriptId,
                    scriptLanguage,
                    scriptParams,
                    scriptType,
                    timeoutValue,
                }} = stageTriggerItemList[0]?.stageTriggerItemParams;

            const targetResourceList = stageTriggerItemList.map(item => {
                const {
                    sortIndex,
                    stageTriggerItemParams,
                    type,
                } = item;
                const {
                    stageScript,
                    targetResource,
                } = stageTriggerItemParams;

                const {
                    id,
                    targetUuid,
                    targetResourceName,
                } = targetResource;
                return {
                    id,
                    sortIndex,
                    type,
                    stageScript,
                    uuid: targetUuid,
                    value: targetUuid,
                    key: targetUuid,
                    name: targetResourceName,
                    title: targetResourceName,
                };
            });
            return {
                ...commonParams,
                chooseScript: scriptId,
                runningEnvironment,
                scriptContents,
                scriptLanguage,
                scriptOrigin: scriptType,
                scriptParams,
                scriptType,
                targetResourceList,
                timeoutValueForExecuteScript: timeoutValue,
            };
        }

        case FILE_DISTRIBUTION.value:
        {
            let targetResourceListMap = {};
            let storageFileListMap = {};
            let targetResourceList = [];
            let storageFileList = [];

            let transmissionMode;
            let uploadLimit;
            let downloadLimit;
            let targetPath;
            let timeoutValue;

            let length = stageTriggerItemList.length;
            for (let i = 0; i < length; i++) {
                const item = stageTriggerItemList[i];
                {
                    const {
                        stageTriggerItemParams,
                    } = item;
                    const {targetResource} = stageTriggerItemParams;
                    const {
                        id,
                        targetUuid,
                        targetResourceName,
                        status,
                    } = targetResource;

                    // 当前元素内部有 id 为 null 的元素，不需要进行数据处理，单纯是为了在页面左侧显示对应的主机列表，不熟悉勿动！
                    if (!id) {
                        continue;
                    }

                    if (!targetResourceListMap[id]) {
                        targetResourceList.push({
                            id,
                            targetUuid,
                            targetResourceName,
                            status,
                            sortIndex,
                            type,
                            uuid: targetUuid,
                            value: targetUuid,
                            key: targetUuid,
                            name: targetResourceName,
                            title: targetResourceName,
                        });
                        targetResourceListMap[id] = true;
                    }
                }
                {

                    const {stageTriggerItemParams} = item;
                    const {
                        storageFile,
                        stageFile,
                    } = stageTriggerItemParams;
                    const {
                        transmissionMode: itemTransmissionMode,
                        timeoutValue: itemTimeoutValue,
                        uploadLimit: itemUploadLimit,
                        downloadLimit: itemDownloadLimit,
                        targetPath: itemTargetPath,
                    } = stageFile;
                    transmissionMode = itemTransmissionMode;
                    uploadLimit = itemUploadLimit;
                    downloadLimit = itemDownloadLimit;
                    targetPath = itemTargetPath;
                    timeoutValue = itemTimeoutValue;
                    const {
                        fileSource,
                        sourceUuid,
                        fileName,
                        storageFilePath,
                        storageFileUrl,
                        storageId,
                        fileMd5,
                        fileSize,
                        status,
                        id,
                    } = storageFile;

                    if (!storageFileListMap[id]) {
                        storageFileList.push({
                            id,
                            fileSource,
                            sourceUuid,
                            sourcePath: propOr(DEFAULT_STRING_VALUE, 'sourcePath', storageFile),
                            sourceResourceName: propOr(DEFAULT_STRING_VALUE, 'sourceResourceName', storageFile),
                            fileName,
                            storageFilePath,
                            storageFileUrl,
                            storageId,
                            fileMd5,
                            fileSize,
                            status,
                        });
                        storageFileListMap[id] = true;
                    }

                }
            }
            return {
                ...commonParams,
                transmissionMode,
                timeoutValueForFileDistribution: timeoutValue,
                uploadLimitDisabled: !uploadLimit,
                downloadLimitDisabled: !downloadLimit,
                uploadLimit: deConvertFileSize(uploadLimit),
                downloadLimit: deConvertFileSize(downloadLimit),
                targetPath,
                storageFileList,
                targetResourceList,
            };
        }
    }
};

