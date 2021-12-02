import React, { useState, useEffect, useRef } from 'react';
import _ from '../../shared/util/base';
import Input from './controls/input';
import SVG from './controls/svg';
import ContentLoader from 'react-content-loader';

const Search = (props) => {

    const { entity, inputStyle, wrapperStyle, hideSearchButton, autoFocus, isLargeSize } = props;

    const keywords = _.isNonEmptyString(props.keywords) ? props.keywords : '';
    const searchInput = useRef(null);

    const [searching, setSearching] = useState(false);

    useEffect(() => {
        if (autoFocus) setTimeout(() => {
            searchInput.current.focus();
        }, 500);
    }, []);

    const onChangeSearch = (value) => {
        if (_.isFunction(props.onChange)) props.onChange(value);
    }

    const submitSearch = (keywords) => {
        setSearching(true);
        setTimeout(() => {
            if (_.isFunction(props.onSubmit)) props.onSubmit(keywords);
        }, 1000);
        
    }

    const onSubmitSearch = () => {
        if (_.isNonEmptyString(keywords)) submitSearch(keywords);
    }

    const onCancelSearch = () => {
        window.location = '/';
    }

    const onChangeEntity = (newEntity) => {
        if (_.isFunction(props.onChangeEntity)) props.onChangeEntity(newEntity);
    }

    return <div id={props.id ? props.id : 'search'} className="search" style={wrapperStyle}>
        <div className="search-row">
            {searching ?
                <div style={{flex: 1}}>
                <ContentLoader
                    uniqueKey="search-loader"
                    speed={2}
                    width={300}
                    height={isLargeSize?50:30}
                    viewBox={isLargeSize?"0 0 300 50":"0 0 300 30"}
                    backgroundColor="#f3f3f3"
                    foregroundColor="#ecebeb"
                >
                    <rect x="10" y={isLargeSize?12:10} rx="3" ry="3" width="300" height="5" />
                    <rect x="10" y={isLargeSize?24:20} rx="3" ry="3" width="200" height="5" />
                    {isLargeSize && <rect x="10" y="36" rx="3" ry="3" width="100" height="5" />}
                </ContentLoader>
                </div>
                 :
                <Input
                    ref={searchInput}
                    value={keywords}
                    placeholder="Search ..."
                    className="input"
                    style={inputStyle}
                    onSubmit={onSubmitSearch}
                    onChange={onChangeSearch} />
                }
            {_.isNonEmptyString(keywords) && !searching && <SVG src="/icons/x.svg" className="button-x" onClick={onCancelSearch} />}
            {!hideSearchButton && !searching && <SVG src="/icons/search.svg" className="button-search" onClick={onSubmitSearch} />}
        </div>
        <div className="condition-row">
            <div className="condition" onClick={() => onChangeEntity('product')} >
                <SVG src={`/icons/${entity != 'page' ? 'checked' : 'unchecked'}-checkbox.svg`} className="checkbox" />
                <span className="text">Products</span>
            </div>
            <div className="condition" onClick={() => onChangeEntity('page')} >
                <SVG src={`/icons/${entity == 'page' ? 'checked' : 'unchecked'}-checkbox.svg`} className="checkbox" />
                <span className="text">Pages</span>
            </div>
        </div>
    </div>
}
export default Search;
