/**
 * antd Select 多选模式下 添加全选
 */
import {useState, useMemo, useEffect} from 'react';
import {omit, cloneDeep} from 'lodash';
import {Select, Tag} from '@osui/ui';
import {SYMBOL_FOR_ALL} from '../../constant';

const SelectAll = props => {
    const {onChange: change, dropdownRender} = props;
    // 已选中的值
    const [selectedVal, setSelectedVal] = useState(props?.value?.[0] === SYMBOL_FOR_ALL && props?.value?.length === 1
        ? [SYMBOL_FOR_ALL, ...props.children.map(item => item.props.value)] : props.value || []);
    // const [manualChange, setManualChange] = useState(false);
    // 带全选的所有值
    const allValWithAll = useMemo(() => {
        const arr = props.children.map(item => item.props?.value);
        arr.unshift(SYMBOL_FOR_ALL);
        return arr;
    }, [props.children]);
    // 不带全选的所有值
    const allVal = useMemo(() => props.children.map(item => item.props?.value), [props.children]);
    const res = props?.value?.[0] === SYMBOL_FOR_ALL && props?.value.length === 1
        ? [SYMBOL_FOR_ALL, ...props.children.map(item => item.props.value)] : props.value || [];

    const tagRender = ({label, closable, onClose}) => {
        if (res.length < allVal.length) {
            return (
                <Tag closable={closable} onClose={onClose}>
                    {label}
                </Tag>
            );
        }
    };

    const onItSelect = val => {
        if (val === SYMBOL_FOR_ALL) {
            setSelectedVal(allValWithAll);
            change(allValWithAll);
        } else {
            if (selectedVal?.length === allVal?.length - 1) {
                setSelectedVal(allValWithAll);
                change(allValWithAll);
            } else {
                setSelectedVal([...selectedVal, val]);
                change([...selectedVal, val]);
            }
        }

    };
    const onItDeselect = val => {
        if (val === SYMBOL_FOR_ALL) {
            setSelectedVal([]);
            change([]);
        } else {
            const hasSelected = cloneDeep(selectedVal);
            if (hasSelected.indexOf(SYMBOL_FOR_ALL) !== -1) {
                hasSelected.splice(hasSelected.findIndex(item => item === SYMBOL_FOR_ALL), 1);
            }
            hasSelected.splice(hasSelected.findIndex(item => item === val), 1);
            setSelectedVal(hasSelected);
            change(hasSelected);
        }
    };
    const onItClear = () => {
        setSelectedVal([]);
        change([]);
    };
    const existProps = ['mode', 'onSelect', 'onDeselect', 'onClear', 'maxTagPlaceholder', 'tagRender'];

    useEffect(() => {
        if (props?.value) {
            if (props?.value?.length) {
                if (props?.value?.[0] === SYMBOL_FOR_ALL && props?.children.length === 1) {
                    const allValWithAll = [SYMBOL_FOR_ALL, ...props.children.map(item => item.props.value)];
                    setSelectedVal(allValWithAll);
                } else {
                    setSelectedVal(props?.value);
                }
            }
        }
    }, [props?.value, props?.children]);
    return (
        <Select
            mode="multiple"
            onSelect={onItSelect}
            onDeselect={onItDeselect}
            showSearch
            optionFilterProp={'children'}
            onClear={onItClear}
            getPopupContainer={originNode => originNode.parentNode}
            maxTagCount={props.maxTagCount || allValWithAll.length}
            maxTagPlaceholder={() => {
                if (res.length < allVal.length) {
                    return <Tag>......</Tag>;
                }
                return (
                    <Tag
                        closable
                        onClose={onItClear}
                    >全选
                    </Tag>
                );
            }}
            tagRender={tagRender}
            dropdownRender={dropdownRender}
            {...omit(props, existProps)}
            value={res}
        >
            <Select.Option key={SYMBOL_FOR_ALL} value={SYMBOL_FOR_ALL}>
                全选
            </Select.Option>
            {props.children}
        </Select>
    );
};

export default SelectAll;
