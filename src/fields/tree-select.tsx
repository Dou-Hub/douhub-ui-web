import React, { useEffect, useState } from 'react';
import { isArray, map, isFunction, each, isNil } from 'lodash';
import { getEntity, isNonEmptyString, isObject } from 'douhub-helper-util';
import { LabelField, NoteField, TreeSelect } from 'douhub-ui-web';
import { callAPI, CSS, SVG, _window, _track } from 'douhub-ui-web-basic';


const DISPLAY_NAME = 'TreeSelectField';

const TREE_SELECT_FIELD_CSS = `
    .field-tree-select-wrapper 
    {
        position: relative;
    }

    .field-tree-select
    {
        margin-bottom: 1rem !important;
        width: 100% !important;
        text-align: left;
        position: relative;
    }

    .field-tree-select-wrapper .delete-button
    {
        width: 12px;
        height: 12px;
        position: absolute;
        right: 16px;
        cursor: pointer;
    }

    .field-tree-select-wrapper.label-hidden-false .delete-button
    {
        top: 26px;
    }

    .field-tree-select-wrapper.label-hidden-true .delete-button
    {
        top: 8px;
    }

    .field-tree-select-no-value .delete-button
    {
        display: none;
    }

    .field-tree-select .ant-select-selector,
    .field-tree-select .ant-select-selection-search,
    .field-tree-select .ant-select-selection-item,
    .field-tree-select .loading
    {
        border-radius: 0;
        padding: 0 !important;
        height: 30px !important;
        border: none !important;
        font-size: 0.9rem;
        text-align: left;
    }

    .field-tree-select  .ant-select-selection-search
    {
        left: 0 !important;
    }


    .field-tree-select.ant-select-focused .ant-select-selector
    {
        border: none !important;
        box-shadow: none !important;
    }

    .field-tree-select .ant-select-arrow
    {
        right: 0;
        cursor: pointer;
    }
`;


const TreeSelectField = (props: Record<string, any>) => {

    const { label, disabled, note, style, labelStyle, inputStyle,
        entityName, entityType, 
        alwaysShowLabel, wrapperStyle } = props;
    const hideLabel = props.hideLabel || !isNonEmptyString(label);
    const solution = _window.solution;
    const defaultValue: Record<string, any> | null = isObject(props.defaultValue) ? props.defaultValue : null;
    const placeholder = isNonEmptyString(props.placeholder) ? props.placeholder : '';
    const className = isNonEmptyString(props.className) ? props.className : '';
    const [data, setData] = useState<Record<string, any>[]>([]);
    const [doing, setDoing] = useState<string>('Loading ...');
    const entity = getEntity(solution, entityName, entityType);
    const [value, setValue] = useState<Record<string, any> | null>(null);

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


    const onChange = (id: any) => {
        if (_track) console.log({ id })
        const newValue = isNonEmptyString(id) ? id : defaultValue;
        const node = isNonEmptyString(newValue) ? findTreeData(data, newValue) : null;
        //console.log({ newValue, node, data });
        if (isFunction(props.onChange)) props.onChange(node);
        setValue(newValue);
    }

    const onDelete = () => {
        onChange(null);
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
        let findItem:any = null;
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

        if (isNonEmptyString(entityName)) {
            setDoing('Loading data ...');
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
        }
    }, [entityName, entityType])

    const onSelect = (v: any) => {
        //console.log({ onSelect: v });
    }

    const renderSelect = () => {
        if (doing) return null;
        return <TreeSelect
            showSearch
            style={{ ...style, ...inputStyle }}
            value={value}
            treeDefaultExpandAll
            placeholder={placeholder}
            onChange={onChange}
            onClear={onClear}
            onFocus={onFocus}
            onBlur={onBlur}
            onSelect={onSelect}
            disabled={disabled}
            treeData={data}
            className={`field field-tree-select ${className} ${disabled ? 'field-disabled' : ''} ${isNonEmptyString(note) ? 'field-note-true' : ''}`}
        />
    }

    const renderDoing = () => {
        if (!doing) return null;
        return <div className={`field field-tree-select ${isNonEmptyString(note) ? 'field-note-true' : ''}`}>
            <span className="loading">Loading ...</span>
        </div>
    }

    const labelHidden = !(!hideLabel && (alwaysShowLabel || isNonEmptyString(value) || !isNonEmptyString(placeholder)));

    return <div className={`flex flex-col w-full field-tree-select-wrapper label-hidden-${labelHidden} ${isNonEmptyString(value) ? 'field-tree-select-has-value' : 'field-tree-select-no-value'}`} style={wrapperStyle}>
        <CSS id="field-tree-select-css" content={TREE_SELECT_FIELD_CSS} />
        <LabelField text={label} disabled={disabled} style={labelStyle}
            hidden={labelHidden}
        />
        {renderSelect()}
        {renderDoing()}
        <SVG src="/icons/x.svg" style={{ width: 12, height: 12 }} color="#999999" className="delete-button" onClick={onDelete} />
        <NoteField text={note} />
    </div>
};

TreeSelectField.displayName = DISPLAY_NAME;
export default TreeSelectField;

