import { SVG, _window } from '../../index';
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
        return without(map(filters, (filter) => {
            switch (filter.type) {
                case 'search': {
                    return <div key={filter.id}
                        className="float-left flex px-2 py-1 mb-2 mr-1 shadow-sm border border-gray-100 rounded-md bg-white items-center">
                        <SVG src='/icons/search.svg' style={{ width: 12 }} />
                        <span className="text-2xs ml-1 mr-1">{filter.search.length>24?`${filter.search.substring(0,24)} ...`:filter.search}</span>
                        <SVG src='/icons/delete.svg' style={{ width: 12, cursor:'pointer' }} onClick={()=>onRemoveFilter(filter)}/>
                    </div>
                }
                default:{
                    return null;
                }
            }
        }),null)
    }

    return <div 
        className="douhub-list-filters float-left bg-gray-50 w-full  px-4 pt-4 pb-2 border border-0 border-b border-r"
        style={{ maxWidth }}>
        {renderFilters()}
        <ReactResizeDetector onResize={throttle(onResize, 300)} />
    </div>
};

export default ListFilters;

