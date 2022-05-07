import {useEffect, useRef} from 'react';
import {omit, propOr} from 'ramda';
import useSwitch from '@react-hook/switch';
import {useDispatch} from 'react-redux';

import {request} from '../../../../request/fetch';
import {URLS, FILE_SOURCE_TYPE, LOADING, SUCCESS, LOADING_STATUS, ERROR} from '../constants';
import {
    DEFAULT_STRING_VALUE,
    REQUEST_METHODS,
    REQUEST_TYPE,
    MAGE_BYTE_SCALE,
} from '../../../../constant';
import {
    assembleRequestUrl, debounceWith250ms, decodeFileKey,
    generateFileKey,
    generateFormData,
    generateMd5ForFile,
    requestCallback,
    Toast,
    useSelectState,
} from '../../../../utils';
import {
    update,
    updateLocalFile,
    updateServerFile,
    updateServerFileBySingleProperty,
    updateAll,
} from '../../../../reduxSlice/fileUpload/uploadDetailSlice';

const useFileSource = ({
    storageFileList,
    values,
    setFormValues,
}) => {
    const dispatch = useDispatch();
    const localFilesMap = useSelectState(['uploadDetail', 'localFilesMap']);
    const serverFilesMap = useSelectState(['uploadDetail', 'serverFilesMap']);

    const updateUploadingMap = item => dispatch(update(item));
    const updateServerFileMap = item => dispatch(updateServerFile(item));
    const updateLocalFileMap = item => dispatch(updateLocalFile(item));
    const updateServerFileMapBySingleProperty = item => dispatch(updateServerFileBySingleProperty(item));

    const retryUploadRef = useRef({});

    const [needUpdateFileMap, toggle] = useSwitch(false);

    const handleUpdateStorageFileList = storageFileList => {
        setFormValues({
            ...values,
            storageFileList,
        });
        toggle.off();
    };
    const handleChangeSourcePath = ({value, key}) => {
        updateServerFileMapBySingleProperty({
            key,
            changedValues: [
                {
                    key: 'sourcePath',
                    value,
                },
            ],
        });
        toggle.on();
    };

    const handleAddServerFile = () => {
        const length = storageFileList?.length;
        let key = 0;
        if (length) {
            const lastItem = storageFileList[length - 1];
            key = lastItem.key + 1;
        }

        updateServerFileMap({
            key,
            value: {
                key,
                fileSource: FILE_SOURCE_TYPE.SERVER,
                sourcePath: '',
                sourceResourceName: '',
                sourceUuid: '',
            },
        });
        toggle.on();
    };

    const handleChangeServerFileSourceResource = (agents, agentMapByUuid, key) => {
        const targetAgent = agents?.[0];

        updateServerFileMapBySingleProperty({
            key,
            changedValues: [
                {
                    key: 'sourceResourceName',
                    value: propOr(DEFAULT_STRING_VALUE, 'name', targetAgent),
                },
                {
                    key: 'sourceUuid',
                    value: propOr(DEFAULT_STRING_VALUE, 'uuid', targetAgent),
                },
            ],
        });
        toggle.on();
    };

    const handleRemoveServerFile = ({key}) => {
        updateServerFileMap({
            key,
            value: null,
        });
        toggle.on();
    };

    const checkLocalRepeatFile = key => {
        if (localFilesMap[key]) {
            Toast.error('您已上传过该文件');
            return false;
        }
        return true;
    };

    const checkFileSizeLimit = fileSize => {
        // 2147483648 2G
        if (fileSize > 2 * Math.pow(MAGE_BYTE_SCALE, 3)) {
            Toast.error('当前只支持上传2G一下大小文件');
            return false;
        }
        return true;
    };

    const updateLocalLoadingStatus = (key, status, extraData) => {
        const {fileName, fileSize} = decodeFileKey(key);
        updateLocalFileMap({
            key,
            value: {
                key,
                ...localFilesMap[key],
                fileName,
                fileSize,
                storageFileUrl: DEFAULT_STRING_VALUE,
                uploadStatusByFrontEnd: status,
                sourcePath: DEFAULT_STRING_VALUE,
                sourceUuid: DEFAULT_STRING_VALUE,
                ...extraData,
            },
        });
        toggle.on();
    };

    const updateLocalErrorCallback = key => {
        updateLocalLoadingStatus(key, LOADING_STATUS.ERROR, {
            status: ERROR.value,
        });
    };
    /**
     * 分片上传完成回调
     */
    const uploadBySeparatingFinished = async params => {
        const {key} = params;

        try {
            const res = await request({
                url: assembleRequestUrl(URLS.UPLOAD_LOCAL_BY_SEPARATING_FINISHED),
                type: REQUEST_TYPE.FORM_DATA,
                params: generateFormData(omit(['fileSize'], params)),
                method: REQUEST_METHODS.POST,
            });
            const {status, data} = res;
            if (!status) {
                const {storageFileUrl} = data;
                updateLocalFileMap({
                    key,
                    value: {
                        key,
                        ...localFilesMap[key],
                        ...omit(['url', 'sourcePath', 'sourceResourceName'], data),
                        storageFileUrl,
                        uploadStatusByFrontEnd: LOADING_STATUS.SUCCESS,
                        sourcePath: DEFAULT_STRING_VALUE,
                        sourceUuid: DEFAULT_STRING_VALUE,
                        status: SUCCESS.value,
                    },
                });
                toggle.on();
            }
        } catch (e) {
            updateLocalErrorCallback(key);
        }
    };

    const updateUploadProcess = ({fileName, currentProcess, total}) => {
        updateUploadingMap({
            fileName,
            process: Math.ceil(currentProcess / total * 100),
            total,
        });
    };

    const updateUploadStatusDuringUpload = ({fileName, chunkNum, chunkCount}) => {
        updateUploadProcess({
            fileName,
            currentProcess: chunkNum,
            total: Math.floor(chunkCount),
        });
    };

    /**
     * 开始分片上传
     * @param originalParams
     *  {uploadStatus,chunkNum,md5,fileSize,chunkCount}
     * @param key
     * @returns {Promise<void>}
     */
    const handleStartUploadBySeparating = async ({
        rest,
        key,
        file,
        index,
        isFinished,
        separateFileObjList = [],
        chunkCount,
    }) => {

        const {
            chunkNum,
            md5,
        } = rest;
        const params = {
            // 分块序号
            chunkNum,
            file,
            md5,
        };
        const res = await request({
            url: assembleRequestUrl(URLS.UPLOAD_LOCAL_BY_SEPARATING),
            method: REQUEST_METHODS.POST,
            type: REQUEST_TYPE.FORM_DATA,
            params: generateFormData(params),
        });
        const {name: fileName, size: fileSize} = file;
        requestCallback({
            res,
            hideMessage: true,
            callback: () => {
                if (isFinished) {
                    uploadBySeparatingFinished({
                        key,
                        md5,
                        fileName,
                        fileSize,
                    });
                } else {
                    updateUploadStatusDuringUpload({fileName, chunkNum, chunkCount});
                    const nextIndex = index + 1;
                    const {file, ...rest} = separateFileObjList[nextIndex];
                    handleStartUploadBySeparating({
                        separateFileObjList,
                        key,
                        file,
                        rest,
                        index: nextIndex,
                        chunkCount,
                        isFinished: nextIndex === separateFileObjList.length - 1,
                    });
                }
            },
            errorCallback: () => {
                updateLocalErrorCallback(key);
            },
        });
    };

    const handleStartUploadByOnce = ({rest, file, key}) => {
        handleStartUploadBySeparating({
            rest,
            key,
            file,
            isFinished: true,
        });
    };

    // 分片批量上传
    const uploadSeparatingByBatching = async (separateFileObjList, chunkCount, fileName, key, index) => {
        const {file, ...rest} = separateFileObjList[index];
        await handleStartUploadBySeparating({
            rest,
            file,
            key,
            index,
            isFinished: index === separateFileObjList.length - 1,
            separateFileObjList,
            chunkCount,
        });
    };

    const updateUploadStatusAfterInit = (data, file) => {
        let {
            chunkNum, // 分片索引(第几个分片)
            chunkCount, // 分片数量
        } = data;

        const {
            name: fileName,
        } = file;
        updateUploadProcess({fileName, currentProcess: chunkNum, total: Math.floor(chunkCount)});
    };

    /**
     * 文件分片
     * @param data 分片参数
     * @param file 源文件
     */
    const handleSeparatingFile = (data, file) => {
        let {
            chunkSize, // 分片大小
            chunkNum, // 分片索引(第几个分片)
            // uploadStatus,
            md5,
            chunkCount, // 分片数量
        } = data;
        const {
            name: fileName,
            size: fileSize,
        } = file;
        let separateFileObjList = [];
        let formatChunkCount = Math.ceil(chunkCount);
        let needBreak = false;
        for (let i = chunkNum; i < formatChunkCount; i++) {
            let start = i * chunkSize + 1;

            let end = start + chunkSize;
            // 最后一个分片不足一个 chunkSize, 需要和当前分片合并
            if (i === formatChunkCount - 1 && formatChunkCount !== chunkCount) {
                end = fileSize;
                needBreak = true;
            }
            let bool = file.slice(start, end);
            let separateFile = new File([bool], fileName);
            const params = {
                chunkNum: i,
                file: separateFile,
                md5,
            };
            separateFileObjList.push(params);
            if (needBreak) {
                break;
            }
        }

        updateUploadStatusAfterInit(data, file);
        return separateFileObjList;
    };

    /**
     * 分片预检成功回调, 判断是否需要分片
     * @param data 预检接口返回数据
     * @param params 当前上传文件参数
     * @param file 当前上传文件
     * @returns {Promise<void>}
     */
    const uploadFileCheckSuccessCallback = async ({data, params, file}) => {
        const {
            chunkSize,
            uploadStatus,
            fileSize,
            chunkNum,
        } = data;
        const {name: fileName} = file;
        const {key} = params;
        updateLocalLoadingStatus(key, LOADING_STATUS.UPLOADING, {
            status: LOADING.value,
        });
        // 有缓存，无需上传文件
        if (uploadStatus) {
            // 更新上传进度
            updateUploadStatusDuringUpload({fileName, chunkNum, chunkCount: chunkNum});
            updateLocalLoadingStatus(key, LOADING_STATUS.SUCCESS, {
                status: LOADING.value,
            });
            await uploadBySeparatingFinished(params);
        } else {
            // 需要上传文件
            const chunkCount = fileSize / chunkSize;
            // 需要分片
            if (chunkCount > 1) {
                const separateFileObjList = handleSeparatingFile({...data, chunkCount}, file);
                let index = 0;
                await uploadSeparatingByBatching(separateFileObjList, chunkCount, fileName, key, index);
            } else {
                // 更新上传进度
                updateLocalLoadingStatus(key, LOADING_STATUS.SUCCESS, {
                    status: LOADING.value,
                });
                updateUploadStatusDuringUpload({fileName, chunkNum, chunkCount});
                await handleStartUploadByOnce({rest: {...params, ...data, chunkCount}, file, key});
            }
        }
    };

    /**
     * 分片上传预检
     * @param params 当前文件参数：
     *      chunkSize(integer): 分片大小
     *      chunkNum(integer): 分片数量
     *      uploadStatus（integer）: 当前文件是否有缓存： 1： 有， 0: 无
     *      md5(string): 当前文件 MD5 值
     * @param file 当前文件
     * @returns {Promise<void>}
     */
    const uploadBySeparatingCheck = async ({params, file}) => {
        const formData = generateFormData(omit(['fileName', 'key'], params));
        const {key} = params;

        try {
            const res = await request({
                url: assembleRequestUrl(URLS.UPLOAD_LOCAL_BY_SEPARATING_CHECK),
                params: formData,
                type: REQUEST_TYPE.FORM_DATA,
                method: REQUEST_METHODS.POST,
            });
            requestCallback({
                res,
                hideMessage: true,
                callback: data => uploadFileCheckSuccessCallback({data, params, file}),
                errorCallback: () => {
                    updateLocalErrorCallback(key);
                },
            });
        } catch (e) {
            updateLocalErrorCallback(key);
        }
    };

    const handleReUploadLocalFile = debounceWith250ms(async key => {
        const {params, file} = retryUploadRef.current[key];
        const {fileName, fileSize} = params;
        updateLocalFileMap({
            key,
            value: {
                key,
                fileName,
                fileSize,
                fileSource: FILE_SOURCE_TYPE.LOCAL,
                status: LOADING.value,
                uploadStatusByFrontEnd: LOADING_STATUS.STARTING,
                sourcePath: DEFAULT_STRING_VALUE,
                sourceResourceName: DEFAULT_STRING_VALUE,
                sourceUuid: DEFAULT_STRING_VALUE,
            },
        });
        toggle.on();
        await uploadBySeparatingCheck({params, file});
    });

    /**
     * 上传本地文件
     * @param e 上传文件数据
     * @param uploadRef 当前上传文件input实例
     * @returns {Promise<void>}
     */
    const handleAddLocalFile = async (e, uploadRef) => {
        const resetInput = () => {
            uploadRef.current.value = '';
        };

        const file = e.target.files[0];

        const {
            name: fileName,
            size: fileSize,
        } = file;

        const key = generateFileKey({fileName, fileSize});

        if (!checkLocalRepeatFile(key)) {
            resetInput();
            return;
        }

        if (!checkFileSizeLimit(fileSize)) {
            resetInput();
            return;
        }

        updateLocalLoadingStatus(key, LOADING_STATUS.STARTING, {
            status: LOADING.value,
        });

        const md5Res = generateMd5ForFile(file);

        const params = {
            fileSize,
            fileName,
            md5: md5Res,
            key,
        };
        retryUploadRef.current[key] = {params, file};

        await uploadBySeparatingCheck({params, file});
    };

    /**
     * 移除本地已上传的文件
     * @param key
     */
    const handleRemoveLocalFile = ({key}) => {
        updateLocalFileMap({
            key,
            value: null,
        });
        toggle.on();
    };

    /**
     * 初始化文件列表
     */
    const initStorageList = () => {
        const length = storageFileList?.length;
        const serverFileMap = {};
        const localFileMap = {};
        for (let i = 0; i < length; i++) {
            const item = storageFileList[i];
            const {fileSource, fileName, fileSize} = item;
            if (fileSource === FILE_SOURCE_TYPE.SERVER) {
                serverFileMap[i] = item;
            } else {
                const key  = generateFileKey({fileName, fileSize});
                localFileMap[key] = {...item, key};
            }
        }
        dispatch(updateAll({localFileMap, serverFileMap}));
    };

    useEffect(() => {
        initStorageList();
    }, []);

    useEffect(() => {
        if (needUpdateFileMap) {
            handleUpdateStorageFileList(Object.values({...localFilesMap, ...serverFilesMap}));
        }
    }, [needUpdateFileMap]);
    return {
        // about server file
        handleChangeSourcePath,
        handleAddServerFile,
        handleChangeServerFileSourceResource,
        handleRemoveServerFile,

        // about local file
        handleAddLocalFile,
        handleRemoveLocalFile,

        needUpdateFileMap,

        handleReUploadLocalFile,
    };
};

export default useFileSource;
