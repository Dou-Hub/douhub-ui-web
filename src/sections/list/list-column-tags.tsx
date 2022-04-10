import React from 'react';
import { isArray, isFunction, map } from 'lodash';
import { shortenString, isNonEmptyString } from 'douhub-helper-util';
import { Tooltip } from '../../index';

export const ListColumnTags = (props: Record<string, any>) => {
    const { tags } = props;

    const className = `${isFunction(props.onClick)?'cursor-pointer':''} rounded-lg bg-gray-50 mr-1 px-1 mt-1 leading-none flex self-center px-2 py-1 ${isNonEmptyString(props.className)?props.className:''}`;

    const onClick = (tag: string)=>{
        if (isFunction(props.onClick)) props.onClick(tag);
    }

    return isArray(tags) && tags.length > 0 ? <div className="w-full flex text-2xs">
        {map(isArray(tags) ? tags : [], (tag: string, index: number) => {
            const shortTag = shortenString(tag, 12);
            if (shortTag == tag) {
                return <span onClick={()=>onClick(tag)} 
                className={className}>{shortTag}</span>
            }
            else {
                return <Tooltip key={index} color="#aaaaaa" placement='top' title={tag}>
                    <span onClick={()=>onClick(tag)} 
                    className={className}>{shortTag}</span>
                </Tooltip>
            }
        })}</div> : null;
}