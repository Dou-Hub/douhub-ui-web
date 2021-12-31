import React from 'react';
import { ReactSVG } from 'react-svg';
import { isFunction } from 'lodash';
import { isNonEmptyString } from 'douhub-helper-util';

const SVG_CSS = () => <style global={true} jsx={true}>{
    `
     .svg {
        line-height: 1;
        height: inherit;
        width: inherit;
    }
    .svg div,
    .svg svg
    {
        height: inherit;
        width: inherit;
    }
`
}
</style>

const SVG = (props: Record<string, any>) => {
    const { style } = props;
    const src = isNonEmptyString(props.src) ? props.src : '';
    const id = `svg_${isNonEmptyString(props.id) ? props.id : src.replace(/[^A-Za-z0-9]+/g, '')}`;
    const color = isNonEmptyString(props.color) ? props.color : '#000000';

    const onClick = () => {
        if (isFunction(props.onClick)) props.onClick();
    }

    const CSS = () => <style jsx={true}>{
        isNonEmptyString(props.color) ? 
        `
            #${id} .svg svg
            {
                fill: ${color};
            }

            #${id} .svg svg path
            {
                fill: ${color};
            }
        `
        : 
        `
        `
    }
    </style>

    return <>
        <SVG_CSS />
        <CSS />
        {isNonEmptyString(src) && <div id={id} onClick={onClick} style={style} className={`svg-wrapper ${props.className ? props.className : ''}`}>
            <ReactSVG src={src} className="svg" />
        </div>}
    </>
}

SVG.displayName = 'controls.svg';
export default SVG;