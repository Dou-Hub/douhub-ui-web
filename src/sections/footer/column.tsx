import React from "react";
import { map } from 'lodash';
import { isNonEmptyString, isObject } from "douhub-helper-util";

const FooterColumnSection = (props: Record<string, any>) => {
    const { data } = props;
    const titleClassName = isNonEmptyString(props.titleClassName) ? props.titleClassName : '';
    const titleStyle = isObject(props.titleStyle) ? props.titleStyle : {};
    const itemClassName = isNonEmptyString(props.itemClassName) ? props.itemClassName : '';
    const itemStyle = isObject(props.itemStyle) ? props.itemStyle : {};


    return <>
        <h3 className={`text-lg font-bold text-gray-600 tracking-wider uppercase ${titleClassName}`} style={titleStyle}>{data.title}</h3>
        <ul role="list" className="mt-4 space-y-4">
            {map(data.items, (item) => (
                <li key={item.title}>
                    <a href={item.href} className={`text-lg text-gray-500 hover:text-gray-700 ${itemClassName}`} style={itemStyle}>
                        {item.title}
                    </a>
                </li>
            ))}
        </ul>
    </>
}

export default FooterColumnSection;