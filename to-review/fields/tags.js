import React, { useState, useRef, useEffect, useMemo } from 'react';
import _ from '../../../shared/util/base';
import Label from './label';
import Note from './note';
import SVG from  '../controls/svg';
import FieldTagsCSS from './tags-css';
import dynamic from 'next/dynamic';
import { logDynamic } from '../controls/base';

let Input = null;
let Sortable = null;
let Checkbox = null;

const DISPLAY_NAME = 'FieldTags';

const FieldTagItem = (props) => {
    const { text } = props;
    const onRemove = () => {
        if (_.isFunction(props.onRemove)) props.onRemove();
    }

    return <div className="tag">
        <div className="text no-text-select">{text}</div>
        <SVG className="x" src="/icons/circle-delete.svg" onClick={onRemove} />
    </div>
};

const processValue = (value, defaultValue) => {
    if (!_.isArray(value)) value = defaultValue;
    if (!_.isArray(value)) value = [];
    return _.without(_.map(value, (item) => {
        const newItem = _.isObject(item) ? item : { text: item };
        return _.isNonEmptyString(newItem.text) ? newItem : null;
    }), null);
}

const FieldTags = React.forwardRef((props, ref) => {

    const { label, disabled, note, supportUrl, labelStyle, 
        inputStyle, alwaysShowLabel, hideLabel, supportAutoSearch } = props;

    const defaultValue = _.isArray(props.defaultValue) ? props.defaultValue : [];
    const placeholder = _.isNonEmptyString(props.placeholder) ? props.placeholder : '';
    const [value, setValue] = useState([]);
    const className = _.isNonEmptyString(props.className) ? props.className : '';
    const [tag, setTag] = useState('');
    const [autoSearch, setAutoSearch] = useState(props.autoSearch == true && supportAutoSearch);
    const inputRef = useRef();

    useEffect(() => {
        const newValue = processValue(props.value, defaultValue);
        if (JSON.stringify(value) !== JSON.stringify(newValue)) {
            onChange(newValue);
        }
    }, [props.value, defaultValue]);

    const onChange = (newValue) => {
        setValue(newValue);
        if (_.isFunction(props.onChange)) props.onChange(newValue);
    }

    const onRemoveTag = (items, removedTag) => {
       
        const newValue = _.without(_.map(items, (v) => {
            if (v.text.trim() == removedTag.trim()) {
                return null;
            }
            else {
                return v;
            }
        }), null);
        onChange(newValue);
    }

    const sortTags = (sortedTags) => {
        const newValue = _.map(sortedTags, (tag) => { return tag});
        if (JSON.stringify(newValue) != JSON.stringify(value)) {
            onChange(newValue);
        }
    }

    const renderTags = () => {

        if (!Sortable) Sortable = logDynamic(dynamic(() => import('../controls/sortable'), { ssr: false }), '../controls/sortable', DISPLAY_NAME);

        const valueSnapshot = _.cloneDeep(valueSnapshot);
        let needOnChange = false;
        const items = _.without(_.map(value, (v) => {
            
            let text = v.text;
            
            if (supportUrl && !_.isNonEmptyString(tag.url) && text.indexOf('|')>0)
            {
                const ts = text.split('|');
                text = ts[0];
                v.text = text;
                v.url = ts[1];
                needOnChange = true;
            }
           
            if (autoSearch && tag.length > 0 && text.indexOf(tag) < 0) return null;
            return _.isNonEmptyString(text) ? v : null;
        }), null);

        if (needOnChange) onChange(items);

        return <Sortable list={items} setList={sortTags} delayOnTouchStart={true} delay={20}>
            {_.map(items, (item) => {
                const text = item.text;
                return <FieldTagItem
                    key={text}
                    text={text.length > 16 ? text.substring(0, 13) + '...' : text}
                    onRemove={() => onRemoveTag(value, text)} />
            })}
        </Sortable>
    }

    const onClickBase = () => {
        if (inputRef && inputRef.current && _.isFunction(inputRef.current.focus)) {
            inputRef.current.focus();
        }
    }

    const onSubmitTag = () => {

        let text = tag;
        let url = null;
        if (supportUrl) {
            const tu = text.split('|');
            if (tu.length > 1) {
                text = tu[0];
                url = tu[1];
            }
        }

        const newValue = _.without(_.map(value, (v) => {
            return v.text.trim() == text.trim() ? null : v;
        }), null);
        
        if (_.isNonEmptyString(url)) {
            newValue.push({ text, url });
        }
        else {
            newValue.push({ text });
        }

        setTag('');
        onChange(newValue);
    }

    const onChangeTag = (e) => {
        setTag(e.target.value);
    }

    const onChangeAutoSearch = () => {
        setAutoSearch(!autoSearch);
    }

    const renderAutoSearch = () => {
        if (!supportAutoSearch) return null;
        if (!Checkbox) Checkbox = logDynamic(dynamic(() => import('../controls/antd/checkbox'), { ssr: false }), '../controls/antd/checkbox', DISPLAY_NAME);
        return <Checkbox
            className="field-tags-auto-search-checkbox"
            onChange={onChangeAutoSearch}
            checked={autoSearch}>
            Auto search and filter the list
        </Checkbox>
    }

    const renderInput = () => {
        if (!Input) Input = logDynamic(dynamic(() => import('../controls/antd/input'), { ssr: false }), '../controls/antd/input', DISPLAY_NAME);
        return <Input
            ref={inputRef}
            style={inputStyle}
            disabled={disabled}
            defaultValue={defaultValue}
            className="field-tags-input field-text"
            placeholder={placeholder}
            onPressEnter={onSubmitTag}
            onChange={onChangeTag}
            value={tag} />
    }

    const count = _.isArray(value) ? value.length : 0;
    const showLabel = !hideLabel && (alwaysShowLabel || count > 0 || !_.isNonEmptyString(placeholder));

    return <>
        <FieldTagsCSS />
        <Label text={label} disabled={disabled} style={labelStyle} hidden={!showLabel} />
        <div className={`field field-tags field-tags-auto-search-${autoSearch} field-tags-${count} ${className} ${disabled ? 'field-disabled' : ''} ${_.isNonEmptyString(note) ? 'field-note-true' : ''}`} onClick={onClickBase}>
            <div className="list">
                {renderTags()}
            </div>
            {renderInput()}
        </div>
        {renderAutoSearch()}
        <Note text={note} />
    </>
});

FieldTags.displayName = DISPLAY_NAME;
export default FieldTags;
