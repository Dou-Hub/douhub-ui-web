import React from 'react';
import {isFunction} from 'lodash';
import {SVG, CSS} from 'douhub-ui-web-basic';
import {isNonEmptyString} from 'douhub-helper-util';

const DISPLAY_NAME = 'AlertField';

const ALERT_FIELD_CSS = `
    .field-alert
    {
        position: relative;
        text-align: left;
    }

    .field-alert.ant-alert-error
    {
        border: 1px solid #ffccc7 !important;
    }

    .field-alert.ant-alert-success
    {
        border: 1px solid #b7eb8f !important;
    }

    .field-alert.ant-alert-info
    {
        border: 1px solid #91d5ff !important;
    }

    .field-alert.ant-alert-warning
    {
        border: 1px solid #ffe58f !important;
    }

    .field-alert.close-true
    {
        padding-right: 25px;
    }

    .field-alert .close
    {
        position: absolute;
        top: 5px;
        right: 5px;
        width: 16px;
        height: 16px;
        cursor: pointer;
    }
`

const AlertField = (props:Record<string,any>) => {

    const { message, description, style } = props;
    const type = isNonEmptyString(props.type) ? props.type.toLowerCase().trim() : 'error';
    const showCloseButton = isFunction(props.onClose);

    return <>
        <CSS id="field-alert-css" content={ALERT_FIELD_CSS}/>
        <div className={`field field-alert field-alert-${type} ant-alert ant-alert-${type} close-${showCloseButton ? 'true' : 'false'}`} style={style}>
            <div className="ant-alert-content">
                <div
                    style={{ display: !isNonEmptyString(message) ? 'none' : 'block' }}
                    className="text-md"
                    dangerouslySetInnerHTML={{ __html: message }} />
                <div
                    style={{ display: !isNonEmptyString(description) ? 'none' : 'block' }}
                    className="text-xs mt-2"
                    dangerouslySetInnerHTML={{ __html: description }} />
            </div>
            {showCloseButton && <SVG src="/icons/x.svg" className="close" onClick={props.onClose} />}
        </div>
    </>
};

AlertField.displayName = DISPLAY_NAME;
export default AlertField;
