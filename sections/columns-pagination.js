import { useEffect, useState } from 'react';
import _ from '../../../shared/util/base';

const ColumnsSectionPagination = (props) => {

    const { data, index } = props;
   
    const onChange = (newIndex) => {
        if (_.isFunction(props.onChange)) props.onChange(newIndex)
    }

    const renderItems = ()=>{
        return _.map(data, (item, i)=>{
            return <div key={i} onClick={()=>onChange(i)}
                    className={`item ${index==i?'item-current':''}`}>
                {i+1}
            </div>
        })
    }

    return <div className="section-columns-pagination">
        {renderItems()}
    </div>
}

ColumnsSectionPagination.displayName = 'ColumnsSectionPagination';
export default ColumnsSectionPagination;