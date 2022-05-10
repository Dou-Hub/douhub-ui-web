import React from "react";
import { map } from 'lodash';
import { isNonEmptyString, isObject } from 'douhub-helper-util';
import { SVG } from 'douhub-ui-web-basic';

const SocialIconsSection = (props: Record<string, any>) => {
    const { data } = props;

    const iconClassName = isNonEmptyString(props.iconClassName) ? props.iconClassName : '';
    const iconStyle = isObject(props.iconStyle) ? props.iconStyle : {};

    const wrapperClassName = isNonEmptyString(props.wrapperClassName) ? props.wrapperClassName : '';
    const wrapperStyle = isObject(props.wrapperStyle) ? props.wrapperStyle : {};


    return <div className={`flex space-x-6 ${wrapperClassName}`} style={wrapperStyle} >
        {map(data, (item) => {
            return <a key={item.name} 
                href={item.href}>
                <span className="sr-only">{item.name}</span>
                <SVG src={item.icon} aria-hidden="true" className={`h-8 w-8 ${iconClassName}`} style={iconStyle}/>
            </a>
        })}
    </div>
}
export default SocialIconsSection;