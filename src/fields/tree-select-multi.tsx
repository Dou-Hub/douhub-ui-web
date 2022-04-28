import React, { useEffect, useState } from 'react';
import { isArray, map, isFunction, each, isNil } from 'lodash';
import { getEntity, isNonEmptyString } from 'douhub-helper-util';
import { LabelField, NoteField, TreeSelect } from '../index';
import { callAPI, CSS, _window, _track } from 'douhub-ui-web-basic';

const DISPLAY_NAME = 'TreeMultiSelectField';

const TREE_SELECT_FIELD_CSS = `
   
    .field-tree-select-multi
    {
        margin-bottom: 1rem !important;
        width: 100% !important;
        text-align: left;
        position: relative;
        min-height: 30px !important;
    }
    

    .field-tree-select-multi .ant-select-selector,
    .field-tree-select-multi .ant-select-selection-search,
    .field-tree-select-multi .ant-select-selection-item,
    .field-tree-select-multi .loading
    {
        border-radius: 0;
        padding: 0 !important;
        border: none !important;
        font-size: 0.8rem;
        text-align: left;
        width: 100%;
    }

    .field-tree-select-multi .loading,
    .field-tree-select-multi input
    {
        font-size: 0.9rem !important;
    }
   
    .field-tree-select-multi .ant-select-selection-placeholder
    {
        font-size: 0.9rem !important;
        right: 0 !important;
        left: 0 !important;
    }

    .field-tree-select-multi .ant-select-selection-overflow-item
    {
        margin-right: 5px;
    }

    .field-tree-select-multi .ant-select-selection-item
    {
        border: solid 1px rgba(0,0,0,0.1) !important;
        background-color: #ffffff;
        border-radius: 0.375rem;
        padding: 6px 8px !important;
        display: flex;
        height: 28px;
        margin-top: 5px !important;
    }

    .field-tree-select-multi .ant-select-selection-item-content
    {
        line-height: 1;
        display: flex;
        align-self: center;
    }

    .field-tree-select-multi  .ant-select-selection-overflow
    {
        margin-top: 5px;
    }

    .field-tree-select-multi  .ant-select-selection-overflow-item-suffix
    {
        width: 100% !important;
        background-color: #ffffff;
        height: 28px;
    }

    .field-tree-select-multi .ant-select-selection-item-remove
    {
       display: flex;
       align-self: center;
    }

    .field-tree-select-multi.ant-select-focused .ant-select-selector
    {
        border: none !important;
        box-shadow: none !important;
    }

    .field-tree-select-multi .ant-select-selection-search
    {
        margin-inline-start: 0 !important;
    }
`;


const TreeMultiSelectField = (props: Record<string, any>) => {

    const { label, disabled, note, style, labelStyle, inputStyle,
        entityName, entityType,
        alwaysShowLabel, wrapperStyle } = props;
    const hideLabel = props.hideLabel || !isNonEmptyString(label);
    const solution = _window.solution;
    const placeholder = isNonEmptyString(props.placeholder) ? props.placeholder : '';
    const className = isNonEmptyString(props.className) ? props.className : '';
    const [data, setData] = useState<Record<string, any>[]>([]);
    const [doing, setDoing] = useState<string>('');
    const entity = getEntity(solution, entityName, entityType);
    const [value, setValue] = useState<string[]>([]);

    useEffect(() => {
        const defaultValue: string[] = isArray(props.defaultValue) ? props.defaultValue : [];
        const newValue = isArray(props.value) ? props.value : defaultValue;
        setValue(newValue);
    }, [props.value, props.defaultValue]);

    if (_track) console.log({ entity, solution, entityName, entityType });

    const onClear = () => {
        if (isFunction(props.onClear)) props.onClear();
    }

    const onFocus = () => {
        if (isFunction(props.onFocus)) props.onFocus();
    }

    const onBlur = () => {
        if (isFunction(props.onBlur)) props.onBlur();
    }

    const getShowCheckedStrategy = () => {
        switch (props.showCheckedStrategy) {
            case 'all': return TreeSelect.SHOW_ALL;
            case 'parent': return TreeSelect.SHOW_PARENT;
            default:
                {
                    return TreeSelect.SHOW_CHILD;
                }
        }

    }


    const onChange = (ids: any, texts: any) => {
        const nodes = [];
        for (let i = 0; i < ids.length; i++) {
            nodes.push({ id: ids[i], text: texts[i] })
        }

        if (isFunction(props.onChange)) props.onChange(nodes);
        setValue(ids);
    }

    const processTreeData = (items: any) => {
        return map(isArray(items) ? items : [],
            (item: any) => {
                const newItem = { ...item, value: item.id, title: item.text };
                if (isArray(item.items)) newItem.children = processTreeData(item.items);
                return newItem;
            })
    }

    const findTreeData = (items: any, id: string) => {
        let findItem: any = null;
        each(isArray(items) ? items : [],
            (item: any) => {
                if (isNil(findItem)) {
                    if (item.id == id) {
                        findItem = { id: item.id, text: item.text };
                    }
                    else {
                        findItem = isArray(item.items) ? findTreeData(item.items, id) : null;
                    }
                }
            });
        return findItem;
    }

    useEffect(() => {

        if (!isNonEmptyString(entityName)) {
            console.error('Please provide entityName');
            return;
        }

        setDoing('Loading ...');

        callAPI(solution, `${solution.apis.organization}retrieve-categories`,
            { regardingEntityName: entityName, regardingEntityType: entityType }, 'GET')
            .then((result: Record<string, any>) => {
                const newData = processTreeData(isArray(result?.data) ? result?.data : [])
                setData(newData);
            })
            .catch((error) => {
                console.error(error);
            })
            .finally(() => {
                setDoing('');
            })

    }, [entityName, entityType])

    const onSelect = (v: any) => {
        console.log({ onSelect: v });
    }

    const renderSelect = () => {
        if (doing) return null;
        return <TreeSelect
            showSearch
            style={{ ...style, ...inputStyle }}
            value={value}
            treeCheckable={true}
            treeDefaultExpandAll
            placeholder={placeholder}
            onChange={onChange}
            onClear={onClear}
            onFocus={onFocus}
            onBlur={onBlur}
            onSelect={onSelect}
            showCheckedStrategy={getShowCheckedStrategy()}
            disabled={disabled}
            treeData={data}
            className={`field field-tree-select-multi ${className} ${disabled ? 'field-disabled' : ''} ${isNonEmptyString(note) ? 'field-note-true' : ''}`}
        />
    }

    const renderDoing = () => {
        if (!doing) return null;
        return <div className={`field field-tree-select-multi ${isNonEmptyString(note) ? 'field-note-true' : ''}`}>
            <span className="loading">Loading ...</span>
        </div>
    }

    const labelHidden = !(!hideLabel && (alwaysShowLabel || isNonEmptyString(value) || !isNonEmptyString(placeholder)));

    return <div className={`flex flex-col w-full field-tree-select-multi-wrapper label-hidden-${labelHidden} ${isNonEmptyString(value) ? 'field-tree-select-multi-has-value' : 'field-tree-select-multi-no-value'}`} style={wrapperStyle}>
        <CSS id="field-tree-select-multi-css" content={TREE_SELECT_FIELD_CSS} />
        <LabelField text={label} disabled={disabled} style={labelStyle}
            hidden={labelHidden}
        />
        {renderSelect()}
        {renderDoing()}
        <NoteField text={note} />
    </div>
};

TreeMultiSelectField.displayName = DISPLAY_NAME;
export default TreeMultiSelectField;

