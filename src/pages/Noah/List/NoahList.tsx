/**
 * 作业平台 作业管理 列表
 */
import React from 'react'
import { Table, PageHeader, Button, Spin, Tooltip, Tag } from '@osui/ui'
import { omit } from 'ramda'
import { useDispatch, useSelector, DefaultRootState } from 'react-redux'

import cx from './index.less'
import useNoahList from './hook'
import { formatTimeStamp, generateDispatchCallback, useSelectState } from '../../../utils'
import OperationBar from './OperationBar'
import EllipsisContainer from '../../../components/EllipsisContainer'
import { MAX_DISPLAY_LENGTH, SPLIT_SYMBOL } from '../../../constant'
import { getNoahList } from '../../../reduxSlice/noah/noahSlice'
import { updateDiskSpaceInfo } from '../../../reduxSlice/diskSpace/diskSpaceSlice'
import { getCategoryList } from '../../../reduxSlice/category/categorySlice'

const title = '作业管理'

const NoahList: React.FC = () => {
  const noah = useSelectState('noah')
  const { loading: noahLoading } = noah
  const diskSpaceInfo = useSelectState('diskSpace')

  const dispatch = useDispatch()
  const updateNoahList = generateDispatchCallback(dispatch, getNoahList)
  const updateCategoryList = generateDispatchCallback(dispatch, getCategoryList)

  const {
    data,
    handlePaginationChange,
    handleChange,
    selectedRowKeys,
    onSelectChange,
    handleMenuClick,
    // 执行作业
    executeNoah,
    // 编辑作业
    editNoah,
    // 删除作业
    removeNoah,
    handleChangeInput,
    noahType,
    // onNoahSelectClear,
    addNoah,
    setNoahType,
    batchSpin,
    onCategorySearchCallback,
    categorySearchName
  } = useNoahList({
    getNoahList: updateNoahList,
    noah,
    updateDiskSpaceInfo: generateDispatchCallback(dispatch, updateDiskSpaceInfo),
    diskSpaceInfo,
    getCategoryList: updateCategoryList
  })

  const tableOperations = [
    {
      label: '执行',
      execution: executeNoah
    },
    {

      label: '编辑',
      execution: editNoah
    },
    {

      label: '删除',
      execution: removeNoah
    }
  ]

  const columns = [
    {
      title: '作业名',
      dataIndex: 'name',
      width: '10%',
      render: val => <EllipsisContainer val={val} />
    },
    {
      title: '分类',
      align: 'center',
      dataIndex: 'typeNames',
      render: val => {
        const types = val?.split(SPLIT_SYMBOL) || []
        const renderTag = type => {
          return <Tag key={type}>{type}</Tag>
        }
        if (types.length > MAX_DISPLAY_LENGTH) {
          return (
            <Tooltip title={val}>
              {types.slice(0, MAX_DISPLAY_LENGTH).map(renderTag)}
              <Tag>...</Tag>
            </Tooltip>
          )
        } else if (types.length > 0) {
          return types.map(renderTag)
        }

        return '未分类'
      }
    },
    {
      title: '创建人',
      align: 'center',
      dataIndex: 'userName'
    },
    {
      title: '创建时间',
      align: 'center',
      dataIndex: 'createTime',
      render (text) {
        return formatTimeStamp(text)
      }
    },
    {
      title: '更新时间',
      align: 'center',
      dataIndex: 'updateTime',
      render (text) {
        return formatTimeStamp(text)
      }
    },
    {
      title: '操作',
      dataIndex: 'operate',
      headerAlign: 'center',
      align: 'right',
      render: (_, record) => {
        return tableOperations.map(item => {
          const { label, execution } = item
          return (
            <Button
              key={label}
              type='link'
              className={cx('operation-button')}
              onClick={() => execution(record)}
            >{label}
            </Button>
          )
        })
      }
    }
  ]

  const rowSelection = {
    selectedRowKeys,
    preserveSelectedRowKeys: true,
    onChange: onSelectChange
  }
  const tableProps = {
    dataSource: data.list,
    columns,
    loading: noahLoading,
    pagination: {
      ...omit('list', data),
      onChange: handlePaginationChange
    },
    rowSelection
  }
  const operationBarProps = {
    noahType,
    handleChange,
    handleChangeInput,
    handleMenuClick,
    addNoah,
    setNoahType,
    onCategorySearchCallback,
    categorySearchName
  }

  return (
    <Spin spinning={batchSpin} tip='正在批量操作，请稍后'>
      <div className={cx('noah-container')}>
        <PageHeader title={title} className={cx('title')} />
        <OperationBar {...operationBarProps} />
        <Table {...tableProps} />
      </div>
    </Spin>
  )
}

export default NoahList
