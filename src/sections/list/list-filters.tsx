import { _window, SVG } from 'douhub-ui-web-basic';
import React from 'react';
import { isArray, isFunction, map, throttle, without } from 'lodash';
import ReactResizeDetector from 'react-resize-detector';

const ListFilters = (props: Record<string, any>) => {

    const { maxWidth } = props;
    const filters = isArray(props.filters)?props.filters:[];

    const onResize = (width?: number, height?: number) => {
        if (isFunction(props.onResizeHeight)) props.onResizeHeight((height ? height : 0) + 35, width);
    }

    const onRemoveFilter = (filter:Record<string, any>) =>
    {
        if (isFunction(props.onRemoveFilter)) props.onRemoveFilter(filter);
    }

    const renderFilters = () => {
        return without(map(filters, (filter, index:number) => {
            const text = filter.text.length>24?`${filter.text.substring(0,24)} ...`:filter.text;
            switch (filter.type) {
                case 'search': {
                    return <div key={index}
                        className="float-left flex px-2 py-1 mb-2 mr-1 shadow-sm border border-gray-100 rounded-md bg-white items-center">
                        <SVG src='/icons/search.svg' style={{ width: 15 }} />
                        <span className="text-base ml-1 mx-2">{text}</span>
                        <SVG src='/icons/delete.svg' style={{ width: 15, cursor:'pointer' }} onClick={()=>onRemoveFilter(filter)}/>
                    </div>
                }
                case 'tag': {
                    return <div key={index}
                        className="float-left flex px-2 py-1 mb-2 mr-1 shadow-sm border border-gray-100 rounded-md bg-white items-center">
                        <span className="text-base mr-2"># {text}</span>
                        <SVG src='/icons/delete.svg' style={{ width: 15, cursor:'pointer' }} onClick={()=>onRemoveFilter(filter)}/>
                    </div>
                }
                case 'category': {
                    return <div key={index}
                    className="float-left flex px-2 py-1 mb-2 mr-1 shadow-sm border border-gray-100 rounded-md bg-white items-center">
                    <SVG src='/icons/category.svg' style={{ width: 15 }} />
                    <span className="text-base mx-2">{text}</span>
                    <SVG src='/icons/delete.svg' style={{ width: 15, cursor:'pointer' }} onClick={()=>onRemoveFilter(filter)}/>
                </div>
                }
                default:{
                    return null;
                }
            }
        }),null)
    }

    return <div 
        className="douhub-list-filters float-left bg-gray-50 w-full  px-4 pt-4 pb-2 border border-0 border-b"
        style={{ maxWidth }}>
        {renderFilters()}
        <ReactResizeDetector onResize={throttle(onResize, 300)} />
    </div>
};

export default ListFilters;

