import React, { useState, useRef, useEffect } from 'react';
import { map, isFunction, isArray, without, isObject } from 'lodash';
import { LabelField, NoteField, SVG, Input, Checkbox, CSS } from '../index';
import { isNonEmptyString } from 'douhub-helper-util';
import { TAGS_CSS } from './tags-css';
import { ReactSortable } from "react-sortablejs";

const TagItem = (props: Record<string, any>) => {
    const { text } = props;
    const onRemove = () => {
        if (isFunction(props.onRemove)) props.onRemove();
    }

    return <div className="tag rounded-md">
        <div className="text no-text-select">{text}</div>
        <SVG className="x" src="/icons/circle-delete.svg" onClick={onRemove} />
    </div>
};

const processValue = (value: Array<string>, defaultValue?: Array<string>): Array<Record<string, any>> => {
    if (!isArray(defaultValue)) defaultValue = [];
    if (!isArray(value)) value = defaultValue;
    if (!isArray(value)) value = [];
    return without(map(value, (v) => {
        const newItem: any = isObject(v) ? v : { text: v };
        return isNonEmptyString(newItem.text) ? newItem : null;
    }), null);
}

const TagsField = React.forwardRef((props: Record<string, any>) => {

    const { label, disabled, note, supportUrl, labelStyle, wrapperStyle,
        inputStyle, alwaysShowLabel, hideLabel, supportAutoSearch } = props;

    const defaultValue = isArray(props.defaultValue) ? props.defaultValue : [];
    const placeholder = isNonEmptyString(props.placeholder) ? props.placeholder : '';
    const [value, setValue] = useState<Array<Record<string, any>>>([]);
    const className = isNonEmptyString(props.className) ? props.className : '';
    const [tagText, setTagText] = useState('');
    const [autoSearch, setAutoSearch] = useState(props.autoSearch == true && supportAutoSearch);
    const inputRef: any = useRef(null);

    useEffect(() => {
        const newValue = processValue(props.value, defaultValue);
        if (JSON.stringify(value) !== JSON.stringify(newValue)) {
            setValue(newValue);
        }
    }, [props.value, props.defaultValue]);

    const onChange = (newValue: Array<Record<string, any>>) => {
        setValue([...newValue]);
        if (isFunction(props.onChange)) props.onChange([...newValue]);
    }

    const onRemoveTag = (items: Array<Record<string, any>>, removedTag: string) => {
        const newValue = without(map(items, (item: any) => {
            if (item.text.trim() == removedTag.trim()) {
                return null;
            }
            else {
                return item;
            }
        }), null);
        onChange(newValue ? newValue : []);
    }

    const sortTags = (sortedTags: Array<Record<string, any>>) => {
        if (JSON.stringify(sortedTags) != JSON.stringify(value)) {
            onChange(sortedTags);
        }
    }

    const renderTags = () => {

        let needOnChange = false;
        const items = without(map(value, (v: any) => {

            let text = v.text;

            if (supportUrl && text.indexOf('|') > 0) {
                const ts = text.split('|');
                text = ts[0];
                v.text = text;
                v.url = ts[1];
                needOnChange = true;
            }

            if (autoSearch && text.indexOf(tagText) < 0) return null;
            return isNonEmptyString(text) ? v : null;
        }), null);

        if (needOnChange) onChange(items);

        console.log({ value, items })

        return <ReactSortable list={items} setList={sortTags} delay={20}>
            {map(items, (item) => {
                const text = item.text;
                return <TagItem
                    key={text}
                    text={text.length > 16 ? text.substring(0, 13) + '...' : text}
                    onRemove={() => onRemoveTag(value, text)} />
            })}
        </ReactSortable>
    }

    const onClickBase = () => {
        if (inputRef && inputRef.current && isFunction(inputRef.current.focus)) {
            inputRef.current.focus();
        }
    }

    const onSubmitTag = () => {

        let text: string = tagText;
        let url: string = '';
        if (supportUrl) {
            const tu = text.split('|');
            if (tu.length > 1) {
                text = tu[0];
                url = tu[1];
            }
        }

        const newValue = without(map(value, (v: any) => {
            return v.text.trim() == text.trim() ? null : v;
        }), null);

        if (isNonEmptyString(url)) {
            newValue.push({ text, url });
        }
        else {
            newValue.push({ text });
        }
        console.log({ newValue })
        setTagText('');
        onChange(newValue);
    }

    const onChangeTag = (v: string) => {
        setTagText(v);
    }

    const onChangeAutoSearch = () => {
        setAutoSearch(!autoSearch);
    }

    const renderAutoSearch = () => {
        if (!supportAutoSearch) return null;
        return <Checkbox
            className="field-tags-auto-search-checkbox"
            onChange={onChangeAutoSearch}
            checked={autoSearch}>
            Auto search and filter the list
        </Checkbox>
    }

    const renderInput = () => {
        return <Input
            ref={inputRef}
            style={inputStyle}
            disabled={disabled}
            defaultValue={defaultValue}
            className="field-tags-input field-text"
            placeholder={placeholder}
            onSubmit={onSubmitTag}
            onChange={onChangeTag}
            value={tagText} />
    }

    const count = isArray(value) ? value.length : 0;
    const showLabel = !hideLabel && (alwaysShowLabel || count > 0 || !isNonEmptyString(placeholder));

    return <div className="flex flex-col w-full" style={wrapperStyle}>
        <CSS id='field-tags-css' content={TAGS_CSS} />
        <LabelField text={label} disabled={disabled} style={labelStyle} hidden={!showLabel} />
        <div className={`field field-tags field-tags-auto-search-${autoSearch} field-tags-${count} ${className} ${disabled ? 'field-disabled' : ''} ${isNonEmptyString(note) ? 'field-note-true' : ''}`} onClick={onClickBase}>
            <div className="list">
                {renderTags()}
            </div>
            {renderInput()}
        </div>
        {renderAutoSearch()}
        <NoteField text={note} />
    </div>
});

export default TagsField;
