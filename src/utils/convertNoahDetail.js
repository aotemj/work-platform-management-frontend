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
        const {
            sourceResourceName = DEFAULT_STRING_VALUE,
            sourcePath = DEFAULT_STRING_VALUE,
        } = item;
        return {
            ...item,
            key: index,
            sourcePath,
            sourceResourceName,
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
                    timeoutValue: originalTimeoutValue,
                    runtimeEnv,
                } = stageScriptBean;
                const timeoutValue = deConvertTimeoutValue(originalTimeoutValue);
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
            case MANUAL_CONFIRM.value: {
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
            case FILE_DISTRIBUTION.value: {

                const {
                    transmissionMode,
                    timeoutValue,
                    uploadLimit,
                    downloadLimit,
                    targetPath,
                } = stageFileBean;
                return {
                    ...commonParams,
                    transmissionMode,
                    timeoutValue,
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
        // useTemp,
        // typeNames,
        // status,
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
            // status
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


