import {TreeSelect} from '@osui/ui';
import React, {useEffect, useMemo, useState} from 'react';
import {clone} from 'ramda';

import DropDownRender from './DropDownRender';

import {AGENT_STATUS, AGENT_TERMINAL_TYPE, LABEL_TYPE, GROUP_TYPES} from '../../constants';
import {getCompanyId, getSpaceId} from '../../../../../utils/getRouteIds';
import {request} from '../../../../../request/fetch';
import cx from './index.less';
import {
    assembleExternalUrl,
    debounceWith250ms,
    debounceWith500ms,
    getDefaultPopupContainer,
} from '../../../../../utils';
import {GLOBAL_URLS, IS_PROD, PAGE_SIZE_OF_NO_PAGINATION} from '../../../../../constant';
import {agents, labels} from '../../../../../temp/agents';
import {formatChildNodes, getAgentMap} from './util';

// label 处理
const formatLabels = (agentMap, labels, currentType) => {
    const labelMap = {};
    const tempLabels = labels.map(label => {
        let tempLabel = clone(label);
        const {id, type} = tempLabel;
        if (currentType !== type) {
            return null;
        }
        const tempAgentObj = agentMap[id];
        tempLabel = formatChildNodes(tempLabel, tempAgentObj);
        const {totalCount, activeCount, labelType, displayName} = tempLabel;
        const labelTypeVal = labelType ? LABEL_TYPE[labelType] : '';

        tempLabel.title = (
            <div
                className={cx('tree-data-parent')}
            >
                <div className={cx('left-content')}>
                    <span className={cx('content')}>{displayName}</span>
                    <span className={cx('tree-data-parent-show')}>
                        {`（${activeCount}/${totalCount}）`}
                    </span>
                </div>
                <span className={cx('tree-data-parent-show')}>
                    {
                        typeof labelTypeVal === 'string'
                            ? <span className={cx(`type-${labelType}`)}>{labelTypeVal}</span>
                            : (
                                labelTypeVal.map((item, index) => (
                                    <span
                                        key={`${+new Date()}_${index + 1}`}
                                        className={cx(`type-${index + 1}`)}
                                    >
                                        {item}
                                    </span>
                                ))
                            )
                    }
                </span>
            </div>
        );
        tempLabel.value = label.id;
        tempLabel.key = label.id;
        labelMap[label.id] = tempLabel;
        return tempLabel;
    });
    return {
        tempLabels,
        labelMap,
        agentMap,
    };
};

const formatData = (agents, labels, currentType) => {
    const {agentMapByUuid, tempMap: agentMap} = getAgentMap(agents);
    return {
        ...formatLabels(agentMap, labels, currentType),
        agentMapByUuid,
    };
};

const TargetServer = ({
    field,
    handleChange,
    visible,
    multiple = true,
    allowClear = true,
    resetUserInputError,
    disabled,
    name,
}) => {
    const companyId = getCompanyId();
    const spaceId = getSpaceId();

    const [needUpdate, setNeedUpdate] = useState(false);
    const [loading, setLoading] = useState(false);

    const [treeData, setTreeData] = useState([]);
    const [labelMap, setLabelMap] = useState({});
    const [agentMap, setAgentMap] = useState({});
    const [agentMapByUuid, setAgentMapByUuid] = useState({});
    const [type, setType] = useState(AGENT_TERMINAL_TYPE.LINUX.value);
    const [labelName, setLabelName] = useState('');

    const handleSearch = debounceWith250ms(e => setLabelName(e));

    const handleChangeType = e => {
        handleSearch('');
        setType(e.target.value);
    };

    const isEnterPriseType = useMemo(() => {
        return getSpaceId() === '';
    }, []);

    const groupType = useMemo(() => {
        return isEnterPriseType ? GROUP_TYPES.ENTERPRISE : GROUP_TYPES.PROJECT;
    }, [isEnterPriseType]);

    const fetchAgents = async () => {

        return request({
            url: assembleExternalUrl(GLOBAL_URLS.AGENTS),
            params: {
                companyUuid: companyId,
                type,
                workspaceId: companyId,
                groupName: spaceId || companyId,
                groupType,
            },
        });
    };

    // labelName    主机名称模糊查询
    // groupName    group名称模糊查询
    // groupType    1 企业 2 组织
    // labelType    用途 1 执行 2 部署 3 执行且部署
    // type         系统 1 win 2 linux
    // companyUuid  租户标识
    // currentPage  当前页
    // pageSize     页大小
    const fetchLabels = async () => {
        return request({
            url: assembleExternalUrl(GLOBAL_URLS.LABELS),
            params: {
                companyUuid: companyId,
                groupName: spaceId || companyId,
                groupType,
                currentPage: '0',
                // TreeSelect 无法监听 scroll 事件， 暂时不做分页处理
                pageSize: PAGE_SIZE_OF_NO_PAGINATION,
                workspaceId: spaceId,
                labelName,
                labelLevel: '',
            },
        });
    };

    const updateData = debounceWith500ms(async () => {
        if (!needUpdate) {
            return;
        }
        setNeedUpdate(false);
        setTreeData([]);
        let tempAgents;
        let tempLabels;
        if (IS_PROD) {
            setLoading(true);
            const [agentRes, labelRes] = await Promise.all([fetchAgents(), fetchLabels()]);
            const {status: agentStatus, entities: {agents = []}} = agentRes;
            setLoading(false);

            const {status: labelStatus, list: labels} = labelRes;

            if (!agentStatus && !labelStatus) {
                tempAgents = agents;
                tempLabels = labels;
            }
        } else {
            tempAgents = agents;
            tempLabels = labels;
        }
        const {labelMap, tempLabels: treeData, agentMap, agentMapByUuid} = formatData(tempAgents, tempLabels, type);
        setTreeData(treeData.filter(item => item));
        setAgentMap(agentMap);
        setLabelMap(labelMap);
        setAgentMapByUuid(agentMapByUuid);
    });

    const getActiveAgentInfoByLabel = labelId => {
        const label = labelMap[labelId];
        if (label.deleteStatus) {
            return [];
        }
        const children = label?.children;
        const length = children?.length;
        const res = [];
        for (let i = 0; i < length; i++) {
            const child = children[i];
            if (child?.status === AGENT_STATUS.ONLINE) {
                res.push(child);
            }
        }
        return res;
    };

    const filterAgent = agent => {
        if (typeof agent === 'number') {
            return getActiveAgentInfoByLabel(agent);
        }
        return [agentMapByUuid[agent]];

    };

    const onChange = e => {
        const agents = [];
        if (multiple) {
            for (let i = 0; i < e.length; i++) {
                const item = e[i];
                agents.push(...filterAgent(item));
            }
        } else {
            agents.push(...filterAgent(e));
        }
        handleChange(agents, agentMapByUuid);
    };

    useEffect(() => {
        setNeedUpdate(visible);
    }, [visible]);

    useEffect(() => {
        updateData();
    }, [needUpdate]);

    useEffect(() => {
        setNeedUpdate(true);
    }, [labelName, type]);

    const dropDownRenderProps = {type, handleChangeType, loading};

    return (
        <TreeSelect
            name={name}
            showSearch
            className={cx('agent-select-tree')}
            dropdownStyle={{maxHeight: 400, overflow: 'auto', width: '100%'}}
            placeholder="请选择目标服务器"
            showArrow
            allowClear={allowClear}
            multiple={multiple}
            onSearch={handleSearch}
            treeData={treeData}
            filterTreeNode={false}
            getPopupContainer={getDefaultPopupContainer}
            treeDefaultExpandAll
            dropdownClassName={cx('agent-select-tree-dropdown')}
            onFocus={resetUserInputError}
            disabled={disabled}
            dropdownRender={originNode => <DropDownRender originNode={originNode} {...dropDownRenderProps} />}
            {...field}
            onChange={onChange}
        />
    );
};

export default TargetServer;
