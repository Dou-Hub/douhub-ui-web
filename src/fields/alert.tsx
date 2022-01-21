import React from 'react';
import {isFunction} from 'lodash';
import SVG from '../controls/svg';
import {isNonEmptyString} from 'douhub-helper-util';

const DISPLAY_NAME = 'FieldAlert';

const FieldAlertCSS = () => <style global jsx>{`
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

    // .field-alert .close svg
    // {
    //     fill: #91d5ff;
    // }

`}</style>

const AlertField = (props:Record<string,any>) => {

    const { message, description, style } = props;
    const type = isNonEmptyString(props.type) ? props.type.toLowerCase().trim() : 'error';
    const showCloseButton = isFunction(props.onClose);

    return <>
        <FieldAlertCSS />
        <div className={`field field-alert field-alert-${type} ant-alert ant-alert-${type} close-${showCloseButton ? 'true' : 'false'}`} style={style}>
            <div className="ant-alert-content">
                <div
                    style={{ display: !isNonEmptyString(message) ? 'none' : 'block' }}
                    className="ant-alert-message"
                    dangerouslySetInnerHTML={{ __html: message }} />
                <div
                    style={{ display: !isNonEmptyString(description) ? 'none' : 'block' }}
                    className="ant-alert-description"
                    dangerouslySetInnerHTML={{ __html: description }} />
            </div>
            {showCloseButton && <SVG src="/icons/x.svg" className="close" onClick={props.onClose} />}
        </div>
    </>
};

AlertField.displayName = DISPLAY_NAME;
export default AlertField;
