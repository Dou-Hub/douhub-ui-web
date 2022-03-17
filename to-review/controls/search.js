import React, { useState, useEffect, useRef } from 'react';
import _ from '../../../shared/util/base';
import Input from './input';
import {SVG} from 'douhub-ui-web-basic';

const Search = (props) => {

    const { keywords, inputStyle, wrapperStyle, autoFocus, placeholder } = props;

    const searchInput = useRef(null);
    const id = props.id ? props.id : 'search';

    const SearchCSS = () => <style jsx>{`
        #${id}
        {
            display: flex;
            border-bottom: solid 1px #cccccc;
            min-width: 200px;
        }

        #${id} input
        {
            height: 28px;
            line-height: 1;
            border: none;
            flex: 1;
        }

        #${id} .button-x, #${id} .button-x svg
        {
            height: 14px;
            width: 14px;
            align-self: center;
            marign-right: 5px;
        }
    `}
    </style>

    useEffect(() => {
        if (autoFocus) setTimeout(() => {
             searchInput.current.focus();
        }, 500);
    }, []);

    const onChangeSearch = (value) => {
        if (_.isFunction(props.onChange)) props.onChange(value);
    }

    const submitSearch = (keywords) => {
        // setKeywords(keywords);
        // searchInput.current.blur();
        if (_.isFunction(props.onSubmit)) props.onSubmit(keywords);
    }

    const onSubmitSearch = () => {
        submitSearch(keywords);
    }

    const onCancelSearch = () => {
        setKeywords('');
    }

    return <>
        <SearchCSS />
        <div id={id} style={wrapperStyle}>
            <Input
                ref={searchInput}
                value={_.isNonEmptyString(keywords)?keywords:''}
                placeholder={_.isNonEmptyString(placeholder)?placeholder:'Search ...'}
                className="input"
                style={inputStyle}
                onSubmit={onSubmitSearch}
                onChange={onChangeSearch} />
            {_.isNonEmptyString(keywords) && <SVG src="/icons/x.svg" className="button-x" onClick={onCancelSearch} />}
        </div>
    </>
}
export default Search;
