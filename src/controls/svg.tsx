import React from 'react';
import { ReactSVG } from 'react-svg';
import { isFunction } from 'lodash';
import { isNonEmptyString } from 'douhub-helper-util';

const CSS = () => <style global={true} jsx={true}>{
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
    const { style, color } = props;
    const src = isNonEmptyString(props.src) ? props.src : '';
    const id = `svg_${isNonEmptyString(props.id) ? props.id : src.replace(/[^A-Za-z0-9]+/g, '')}`;

    const onClick = () => {
        if (isFunction(props.onClick)) props.onClick();
    }

    const css = isNonEmptyString(color) ? `
        #${id} .svg svg
        {
            fill: ${color};
        }

        #${id} .svg svg path
        {
            fill: ${color};
        }
    `: ''

    return <>
        {isNonEmptyString(css) && isNonEmptyString(src) && <style key="css" dangerouslySetInnerHTML={{ __html: css }} />}
        {isNonEmptyString(src) && <div id={id} onClick={onClick} style={style} className={`svg-wrapper ${props.className ? props.className : ''}`}>
            {CSS}
            <ReactSVG src={src} className="svg" />
        </div>}
    </>
}

SVG.displayName = 'controls.svg';
export default SVG;