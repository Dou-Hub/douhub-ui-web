import React from 'react';
import {isFunction} from 'lodash';
import SVG from '../controls/svg';
import {isNonEmptyString} from 'douhub-helper-util';
import CSS from '../controls/css';

const DISPLAY_NAME = 'AlertField';

const ALERT_FIELD_CSS = `
    .field-alert
    {
        position: relative;
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
        border: 1px solid #b7eb8f !ffe58f;
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
                    className="ant-alert-message text-sm"
                    dangerouslySetInnerHTML={{ __html: message }} />
                <div
                    style={{ display: !isNonEmptyString(description) ? 'none' : 'block' }}
                    className="ant-alert-description text-xs mt-2"
                    dangerouslySetInnerHTML={{ __html: description }} />
            </div>
            {showCloseButton && <SVG src="/icons/x.svg" className="close" onClick={props.onClose} />}
        </div>
    </>
};

AlertField.displayName = DISPLAY_NAME;
export default AlertField;
