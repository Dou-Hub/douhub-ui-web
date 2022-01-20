import React from 'react';
import FieldCSS from './css';
import {isFunction} from 'lodash';
import { isNonEmptyString } from 'douhub-helper-util';
import { marked } from 'marked';

const FieldSectionCSS = () => <style global={true} jsx={true}>
    {`
    .field-section
    {
        margin-top: 2rem;
        margin-bottom: 1rem;
        padding: 0.5rem 0;
        border-left: none;
        border-top: none;
        border-right: none;
    }

    .field-section p
    {
        margin-bottom: 0;
    }

`}
</style>


const FieldSection = (props: Record<string, any>) => {
    const { title, subTitle, disabled, style, className } = props;

    const onClick = (e:any) => {
        if (isFunction(props.onClick)) props.onClick(e);
    }

    return (
        <>
            <FieldCSS />
            <FieldSectionCSS />
            <div style={style} className={`text-left border border-b field-section ${disabled ? 'field-disabled' : ''} ${className?className:''}`} onClick={onClick}>
                <div className="text-base" dangerouslySetInnerHTML={{ __html: marked(title) }} />
                {isNonEmptyString(subTitle) && <div className="text-xs text-gray-500" dangerouslySetInnerHTML={{ __html: marked(subTitle) }} />}
            </div>
        </>
    )
}

FieldSection.displayName = 'FieldSection';
export default FieldSection;
