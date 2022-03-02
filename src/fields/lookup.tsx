import React, { useEffect, useState, useMemo, useRef } from 'react';
import { map, find, isNil, isObject, debounce, isFunction } from 'lodash';
import { getEntity, isNonEmptyString } from 'douhub-helper-util';
import { LabelField, CSS, NoteField, Select, callAPI, SVG, _window, SelectProps } from '../index';

const DISPLAY_NAME = 'LookupField';

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
        width: 10px;
        height: 10px;
        position: absolute;
        right: 15px;
        top: 10px;
        cursor: pointer;
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
}
function DebounceSelect<
    ValueType extends { key?: string; label: React.ReactNode; value: string | number } = any,
    >({ fetchOptions, debounceTimeout = 800, ...props }: DebounceSelectProps) {
    const [fetching, setFetching] = useState(false);
    const [options, setOptions] = useState<ValueType[]>([]);
    const fetchRef = useRef(0);

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
                console.log({ newOptions })
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
        entityName, entityType, attributes, searchOnly, 
        alwaysShowLabel, hideLabel, wrapperStyle } = props;
    
    const searchMethod =`${props.searchMetho}`.toLowerCase()=='elastic'?'elastic':'contain';
    const solution = _window.solution;
    const defaultValue: Record<string, any> | null = isObject(props.defaultValue) ? props.defaultValue : null;
    const placeholder = isNonEmptyString(props.placeholder) ? props.placeholder : '';
    const className = isNonEmptyString(props.className) ? props.className : '';
    const [searchResult, setSearchResult] = useState<Record<string, any>>([]);
    const entity = getEntity(solution, entityName, entityType);
    const [value, setValue] = useState<Record<string, any>|null>(null);

    const onChange = (newValue: any) => {
        newValue = isObject(newValue) ? newValue : (isObject(defaultValue) ? { label: defaultValue.display, id: defaultValue.id } : null);
        const record = isNil(newValue)? null: find(searchResult, (r: any) => r.id == newValue.value);
        if (isFunction(props.onChange)) props.onChange(isObject(record)?{...record}:null, newValue?newValue.value:null);
        setValue(searchOnly?null:newValue);
    }

    const onDelete = ()=>{
        onChange(null);
    }

    useEffect(() => {
        setValue(isObject(props.value) ? props.value : (isObject(defaultValue) ? { label: defaultValue.display, id: defaultValue.id } : null));
    }, [props.value]);


    const doSearch = async (search: string): Promise<Array<Record<string, any>>> => {
        // setSearching(true);
        const query: Record<string, any> = {
            "entityName": entity?.entityName,
            attributes,
            "orderBy": [{ "type": "desc", "attribute": "_ts" }]
        };

        let apiEndpoint = `${entity?.apis?.data ? entity?.apis?.data : solution.apis.data}${searchMethod=='elastic'?'search':'query'}`;
        query.keywords = search;
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
            placeholder={placeholder}
            fetchOptions={doSearch}
            onChange={onChange}
            disabled={disabled}
            className={`field field-lookup ${className} ${disabled ? 'field-disabled' : ''} ${isNonEmptyString(note) ? 'field-note-true' : ''}`}
        />
    }

    return <div className={`flex flex-col w-full field-lookup-wrapper ${isObject(value)?'field-lookup-has-value':'field-lookup-no-value'}`} style={wrapperStyle}>
        <CSS id="field-lookup-css" content={LOOKUP_FIELD_CSS} />
        <LabelField text={label} disabled={disabled} style={labelStyle}
            hidden={!(!hideLabel && (alwaysShowLabel || isNonEmptyString(value) || !isNonEmptyString(placeholder)))}
        />
        {renderSelect()}
        <SVG src="/icons/x.svg" style={{width:10, height:10}} color="#999999" className="delete-button" onClick={onDelete}/>
        <NoteField text={note} />
    </div>
};

LookupField.displayName = DISPLAY_NAME;
export default LookupField;