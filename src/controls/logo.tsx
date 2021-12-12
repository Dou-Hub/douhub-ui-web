
import React from 'react';
import { isNonEmptyString } from 'douhub-helper-util';
import { isFunction, isNumber } from 'lodash';
import SVG from './svg';

const Logo = (props: Record<string, any>) => {

    const { color, id, text, textStyte, logoStyle } = props;
    const iconSize = isNumber(props.iconSize) && props.iconSize > 0 ? props.iconSize : 40;
    const textSize = isNonEmptyString(props.textSize) ? props.textSize : 'xl';
    const colorLevel = isNumber(props.colorLevel) ? props.colorLevel : 500;
    const logoSrc = isNonEmptyString(props.logoSrc) ? props.logoSrc : '/logo.svg';

    const onClick = ()=>{
        if (isFunction(props.onClick)) props.onClick();
    }

    return <div className="flex justify-start">
        <div className="flex flex-row" 
            style={isFunction(props.onClick)?{cursor:'pointer'}:{}} 
            onClick={onClick}>
            {logoSrc.indexOf('.svg') > 0 ?
                <SVG id={id} src={logoSrc}
                    className="w-auto"
                    color={color}
                    style={{ width: iconSize, ...logoStyle }}
                /> :
                <img id={id}
                    src={logoSrc}
                    className="w-auto"
                    style={{ width: iconSize, ...logoStyle }}
                />}
            {isNonEmptyString(text) && <span
                className={`text-${textSize} font-bold mx-2 self-center text-${color}-${colorLevel}`}
                style={{ marginLeft: 10, alignSelf: 'center', ...textStyte }}
            >
                {text}
            </span>}
        </div>
    </div>
}

Logo.displayName = 'controls.logo';
export default Logo;