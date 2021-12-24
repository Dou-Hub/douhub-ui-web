
import React from 'react';
import { isNonEmptyString } from 'douhub-helper-util';
import { isFunction, isNumber } from 'lodash';
import SVG from './svg';

const Logo = (props: Record<string, any>) => {

    const { color, id, text, logoStyle } = props;
    const iconSize = isNumber(props.iconSize) && props.iconSize > 0 ? props.iconSize : 40;
    const logoSrc = isNonEmptyString(props.logoSrc) ? props.logoSrc : '/logo.svg';
    const textStyle = {marginLeft: 10, marginRight: 10, alignSelf: 'center', color, fontSize:'1.2rem', fontWeight:700, ...props.textStyle};

    const onClick = () => {
        if (isFunction(props.onClick)) props.onClick();
    }

    return <div className="flex justify-start">
        <div className="flex flex-row"
            style={isFunction(props.onClick) ? { cursor: 'pointer' } : {}}
            onClick={onClick}>
            {logoSrc.indexOf('.svg') > 0 ?
                <SVG id={id} src={logoSrc}
                    color={color}
                    style={{ width: iconSize, ...logoStyle }}
                /> :
                <img id={id}
                    src={logoSrc}
                    style={{ width: iconSize, ...logoStyle }}
                />}
            {isNonEmptyString(text) && <span style={textStyle}>
                {text}
            </span>}
        </div>
    </div>
}

Logo.displayName = 'controls.logo';
export default Logo;