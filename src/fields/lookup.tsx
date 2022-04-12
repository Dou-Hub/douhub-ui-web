import React, { useEffect, useState, useMemo, useRef } from 'react';
import { map, find, isNil, debounce, isFunction, isInteger, isArray } from 'lodash';
import { getEntity, isNonEmptyString, isObject } from 'douhub-helper-util';
import { LabelField, NoteField, Select, SelectProps } from '../index';
import { callAPI, CSS, SVG, _window, _track } from 'douhub-ui-web-basic';

const DISPLAY_NAME = 'LookupField';
const DEFAULT_LOOKUP_ATTRIBUTES = 'id,avatar,firstName,lastName,fullName,name,title,display,text,entityName,entityType,modifiedOn';

const LOOKUP_FIELD_CSS = `
    .field-lookup-wrapper 
    {
        position: relative;
    }

    .field-lookup
    {
        margin-bottom: 1rem !important;
        width: 100% !important;
        text-align: left;
        position: relative;
    }

    .field-lookup-wrapper .delete-button
    {
        width: 12px;
        height: 12px;
        position: absolute;
        right: 16px;
        cursor: pointer;
    }

    .field-lookup-wrapper.label-hidden-false .delete-button
    {
        top: 26px;
    }

    .field-lookup-wrapper.label-hidden-true .delete-button
    {
        top: 8px;
    }

    .field-lookup-no-value .delete-button
    {
        display: none;
    }

    .field-lookup .ant-select-selector,
    .field-lookup .ant-select-selection-search,
    .field-lookup .ant-select-selection-item
    {
        border-radius: 0;
        padding: 0 !important;
        height: 30px !important;
        border: none !important;
        font-size: 0.9rem;
        text-align: left;
    }

    .field-lookup  .ant-select-selection-search
    {
        left: 0 !important;
    }


    .field-lookup.ant-select-focused .ant-select-selector
    {
        border: none !important;
        box-shadow: none !important;
    }

    .field-lookup .ant-select-arrow
    {
        right: 0;
    }
`;

export interface DebounceSelectProps<ValueType = any>
    extends Omit<SelectProps<ValueType>, 'options' | 'children'> {
    fetchOptions: (search: string) => Promise<ValueType[]>;
    debounceTimeout?: number;
    records?: Record<string, any>[]
}
function DebounceSelect<
    ValueType extends { key?: string; label: React.ReactNode; value: string | number } = any,
    >({ fetchOptions, debounceTimeout = 800, ...props }: DebounceSelectProps) {
    const [fetching, setFetching] = useState(false);
    const [options, setOptions] = useState<ValueType[]>([]);
    const fetchRef = useRef(0);

    useEffect(() => {
        if (isArray(props.records) && props.records.length > 0) {
            const options: any = map(props.records, (o: Record<string, any>) => {
                return { label: o.display, value: o.id, record: { ...o } };
            });
            setOptions(options);
        }
    }, [props.records])

    const debounceFetcher = useMemo(() => {
        const loadOptions = (value: string) => {
            fetchRef.current += 1;
            const fetchId = fetchRef.current;
            setOptions([]);
            setFetching(true);

            fetchOptions(value).then((newOptions: Record<string, any>[]) => {
                if (fetchId !== fetchRef.current) {
                    // for fetch callback order
                    return;
                }
                const options: any = map(newOptions, (o: Record<string, any>) => {
                    return { label: o.display, value: o.id, record: { ...o } };
                });
                if (_track) console.log({ newOptions })
                setOptions(options);
                setFetching(false);
            });
        };

        return debounce(loadOptions, debounceTimeout);
    }, [fetchOptions, debounceTimeout]);

    return (
        <Select<ValueType>
            labelInValue
            filterOption={false}
            onSearch={debounceFetcher}
            notFoundContent={fetching ? <div className="flex w-full"><SVG src="/icons/loading.svg" className="spinner" style={{ width: 18, height: 18 }} /><span className="ml-2 text-sm">Searching ...</span></div> : null}
            {...props}
            options={options}
        />
    );
}

const LookupField = (props: Record<string, any>) => {

    const { label, disabled, note, style, labelStyle, inputStyle,
        entityName, entityType, searchOnly, fullRecord,
        alwaysShowLabel, wrapperStyle } = props;
    const hideLabel = props.hideLabel || !isNonEmptyString(label);
    const searchMethod = `${props.searchMethod}`.toLowerCase() == 'elastic' ? 'elastic' : 'contain';
    const solution = _window.solution;
    const defaultValue: Record<string, any> | null = isObject(props.defaultValue) ? props.defaultValue : null;
    const placeholder = isNonEmptyString(props.placeholder) ? props.placeholder : '';
    const className = isNonEmptyString(props.className) ? props.className : '';
    const [searchResult, setSearchResult] = useState<Record<string, any>[]>([]);
    const entity = getEntity(solution, entityName, entityType);
    const [value, setValue] = useState<Record<string, any> | null>(null);
    const attributes = isNonEmptyString(props.attributes) ? props.attributes : (fullRecord == true ? '*' : DEFAULT_LOOKUP_ATTRIBUTES);
    const count = isInteger(props.count) && props.count > 0 ? props.count : 20;

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

    const onChange = (newValue: any) => {
        if (_track) console.log({ newValue })
        newValue = isObject(newValue) ? newValue : (isObject(defaultValue) ? { label: defaultValue?.display, id: defaultValue?.id } : null);
        const record = isNil(newValue) ? null : find(searchResult, (r: any) => r.id == newValue.value);
        if (isFunction(props.onChange)) props.onChange(isObject(record) ? { ...record } : null);
        setValue(searchOnly ? null : newValue);
    }

    const onDelete = () => {
        onChange(null);
    }

    useEffect(() => {
        let newValue = null;
        if (isObject(props.value)) {
            const { id, display } = props.value;
            if (isNonEmptyString(id)) {
                newValue = { label: isNonEmptyString(display) ? display : id, id };
            }
        }
        else {
            if (isObject(defaultValue)) {
                newValue = { label: defaultValue?.display, id: defaultValue?.id }
            }
        }

        setValue(newValue);
    }, [props.value]);

    useEffect(() => {
        if (props.preLoad == true) {
            doSearch('');
        }
    }, [props.preLoad]);


    const doSearch = async (search: string): Promise<Array<Record<string, any>>> => {
        // setSearching(true);
        const query: Record<string, any> = {
            top: count,
            "entityName": entity?.entityName,
            attributes,
            scope: isNonEmptyString(props.scope) ? props.scope : 'organization',
            "orderBy": [{ "type": "desc", "attribute": "_ts" }]
        };

        let apiEndpoint = `${entity?.apis?.data ? entity?.apis?.data : solution.apis.data}${searchMethod == 'elastic' ? 'search' : 'query'}`;
        if (isNonEmptyString(search)) query.keywords = search;
        let data: Array<Record<string, any>> = [];

        try {
            const newResult = await callAPI(solution, apiEndpoint, { query }, 'post');
            data = newResult.data;
            setSearchResult(data);
        }
        catch (error: any) {
            console.error(error);
            setSearchResult([]);
        }
        finally {

        }

        return data;
    }


    const renderSelect = () => {

        return <DebounceSelect
            style={{ ...style, ...inputStyle }}
            value={value}
            showSearch={true}
            records={searchResult}
            placeholder={placeholder}
            fetchOptions={doSearch}
            onChange={onChange}
            onClear={onClear}
            onFocus={onFocus}
            onBlur={onBlur}
            disabled={disabled}
            className={`field field-lookup ${className} ${disabled ? 'field-disabled' : ''} ${isNonEmptyString(note) ? 'field-note-true' : ''}`}
        />
    }

    const labelHidden = !(!hideLabel && (alwaysShowLabel || isNonEmptyString(value) || !isNonEmptyString(placeholder)));

    return <div className={`flex flex-col w-full field-lookup-wrapper label-hidden-${labelHidden} ${isObject(value) ? 'field-lookup-has-value' : 'field-lookup-no-value'}`} style={wrapperStyle}>
        <CSS id="field-lookup-css" content={LOOKUP_FIELD_CSS} />
        <LabelField text={label} disabled={disabled} style={labelStyle}
            hidden={labelHidden}
        />
        {renderSelect()}
        <SVG src="/icons/x.svg" style={{ width: 12, height: 12 }} color="#999999" className="delete-button" onClick={onDelete} />
        <NoteField text={note} />
    </div>
};

LookupField.displayName = DISPLAY_NAME;
export default LookupField;

