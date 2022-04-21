import {useCallback, useEffect, useMemo, useState} from 'react';
import {clone, omit, propOr} from 'ramda';
import urlJoin from 'url-join';

import {request} from '../../../../request/fetch';
import {URLS, FILE_SOURCE_TYPE, LOADING, SUCCESS, ERROR} from '../constants';
import {
    DEFAULT_STRING_VALUE,
    REQUEST_METHODS,
    REQUEST_TYPE,
    COMMON_URL_PREFIX,
    MAGE_BYTE_SCALE,
} from '../../../../constant';
import {Toast} from '../../../../utils';

let tempFileMap = {};

const useFileSource = ({
    // changeCallback,
    storageFileList,
    values,
    setFormValues,
}) => {

    const [serverFiles, setServerFiles] = useState([]);

    const [localFiles, setLocalFiles] = useState([]);

    const [fileMap, setFileMap] = useState({});

    const [needUpdateFileMap, setNeedUpdateFileMap] = useState(false);

    const chooseServerTips = useMemo(() => {
        return `已选择 ${serverFiles.length} 个服务器文件`;
    }, [serverFiles.length]);

    const chooseLocalTips = useMemo(() => {
        return `已选择 ${localFiles.length} 个本地文件`;
    }, [localFiles.length]);

    const handleUpdateStorageFileList = useCallback(storageFileList => {
        setFormValues({
            ...values,
            storageFileList,
        });
        setNeedUpdateFileMap(false);
    }, [setFormValues, values]);
    const handleChangeSourcePath = useCallback(({value, key}) => {
        const tempFileMap = clone(fileMap);
        tempFileMap[key].sourcePath = value;

        setFileMap(tempFileMap);
        setNeedUpdateFileMap(true);
    }, [fileMap]);

    const handleAddServerFile = useCallback(() => {
        const length = storageFileList?.length;
        let key = 0;
        if (length) {
            const lastItem = storageFileList[length - 1];
            key = lastItem.key + 1;
        }

        const data = {
            key,
            fileSource: FILE_SOURCE_TYPE.SERVER,
            sourcePath: '',
            sourceResourceName: '',
            sourceUuid: '',
        };

        setFileMap({
            ...fileMap,
            [key]: data,
        });
        setNeedUpdateFileMap(true);
    }, [fileMap, storageFileList]);

    const handleChangeServerFileSourceResource = useCallback((agents, agentMapByUuid, key) => {
        let tempFileMap = clone(fileMap);
        const targetAgent = agents?.[0];
        tempFileMap[key].sourceResourceName = propOr(DEFAULT_STRING_VALUE, 'name', targetAgent);
        tempFileMap[key].sourceUuid = propOr(DEFAULT_STRING_VALUE, 'uuid', targetAgent);
        setFileMap(tempFileMap);
        setNeedUpdateFileMap(true);
    }, [fileMap]);

    const handleRemoveServerFile = useCallback(current => {
        const {key} = current;
        const fileMapTemp = clone(fileMap);

        delete fileMapTemp[key];

        setFileMap(fileMapTemp);
        setNeedUpdateFileMap(true);
    }, [fileMap]);

    const updateServerAndLocalFiles = useCallback(() => {
        const length = storageFileList?.length;
        const serverArr = [];
        const localArr = [];
        const fileMapTemp = {};
        for (let i = 0; i < length; i++) {
            const item = storageFileList[i];
            const {fileSource, key} = item;
            if (fileSource === FILE_SOURCE_TYPE.SERVER) {
                serverArr.push(item);
            } else {
                localArr.push(item);
            }
            fileMapTemp[key] = item;
        }
        setLocalFiles(localArr);
        setServerFiles(serverArr);
        setFileMap(fileMapTemp);
        setNeedUpdateFileMap(false);
    }, [storageFileList]);

    const handleAddLocalFile = async e => {
        const params = new FormData();
        const {
            name: fileName,
            size: fileSize,
        } = e.target.files[0];

        const key = Date.now();
        // 2556442818
        // 2147483648
        if (fileSize > 2 * Math.pow(MAGE_BYTE_SCALE, 3)) {
            Toast.error('当前只支持上传2G一下大小文件');
            return;
        }
        const tempData = {
            key,
            fileName,
            fileSize,
            fileSource: FILE_SOURCE_TYPE.LOCAL,
            status: LOADING.value,
            sourcePath: DEFAULT_STRING_VALUE,
            sourceResourceName: DEFAULT_STRING_VALUE,
        };

        const newFileMap = {
            ...fileMap,
            [key]: tempData,
        };
        setFileMap(newFileMap);
        setNeedUpdateFileMap(true);
        // 当前tempFileMap 为异步，不可以使用 useState 声明
        tempFileMap = clone(newFileMap);

        params.append('file', e.target.files[0]);
        try {
            const res = await request({
                url: urlJoin(COMMON_URL_PREFIX, URLS.UPLOAD_LOCAL_FILE),
                params,
                method: REQUEST_METHODS.POST,
                type: REQUEST_TYPE.FORM_DATA,
            });
            const {status, data} = res;

            if (!status) {
                const {key} = tempData;
                const {storageFileUrl} = data;
                const newTempData = {
                    ...tempData,
                    ...omit(['url', 'sourcePath', 'sourceResourceName'], data),
                    storageFileUrl,
                    status: SUCCESS.value,
                };
                tempFileMap = {
                    ...fileMap,
                    ...tempFileMap,
                    [key]: newTempData,
                };
                setFileMap(tempFileMap);
                setNeedUpdateFileMap(true);
            } else {
                const {key} = tempData;
                const newTempData = {
                    ...tempData,
                    status: ERROR.value,
                };

                tempFileMap = {
                    ...fileMap,
                    ...tempFileMap,
                    [key]: newTempData,
                };
                setFileMap(tempFileMap);
                setNeedUpdateFileMap(true);
            }
        } catch (e) {
        }

    };

    const handleRemoveLocalFile = useCallback(current => {
        const {key} = current;
        const fileMapTemp = clone(fileMap);

        delete fileMapTemp[key];

        setFileMap(fileMapTemp);
        setNeedUpdateFileMap(true);
    }, [fileMap]);

    useEffect(() => {
        updateServerAndLocalFiles();
    }, [storageFileList, updateServerAndLocalFiles]);


    useEffect(() => {
        if (needUpdateFileMap) {
            handleUpdateStorageFileList(Object.values(fileMap));
        }
    }, [fileMap, handleUpdateStorageFileList, needUpdateFileMap]);
    return {
        // about server file
        handleChangeSourcePath,
        handleAddServerFile,
        handleChangeServerFileSourceResource,
        handleRemoveServerFile,
        chooseServerTips,
        serverFiles,

        // about local file
        handleAddLocalFile,
        localFiles,
        handleRemoveLocalFile,
        chooseLocalTips,
    };
};

export default useFileSource;
