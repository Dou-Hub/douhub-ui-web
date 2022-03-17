import React from 'react';
import { FIELD_CSS } from './css';
import { isFunction } from 'lodash';
import { isNonEmptyString } from 'douhub-helper-util';
import { marked } from 'marked';
import { CSS } from 'douhub-ui-web-basic'

const SECTION_FIELD_CSS = `
.field-section
{
    margin-top: 2rem;
    margin-bottom: 2rem;
    width: 100%;
    position: relative;
    display: flex;
    flex-direction: column !important;
}

.field-section p
{
    margin-bottom: 0;
}
`;

const FieldSection = (props: Record<string, any>) => {
    const { title, subTitle, disabled, style, className } = props;

    const onClick = (e: any) => {
        if (isFunction(props.onClick)) props.onClick(e);
    }

    return (
        <>
            <CSS id="field-css" content={FIELD_CSS} />
            <CSS id="field-section-css" content={SECTION_FIELD_CSS} />
            <div style={style} className={`p-3 bg-gray-50 border border-0 border-l text-left field-section ${disabled ? 'field-disabled' : ''} ${className ? className : ''}`} onClick={onClick}>
                <div className="w-full text-base" dangerouslySetInnerHTML={{ __html: marked(title) }} />
                {isNonEmptyString(subTitle) && <div className="w-full text-xs text-gray-500" dangerouslySetInnerHTML={{ __html: marked(subTitle) }} />}
            </div>
        </>
    )
}


FieldSection.displayName = 'FieldSection';
export default FieldSection;