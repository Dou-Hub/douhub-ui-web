//  COPYRIGHT:       DouHub Inc. (C) 2021 All Right Reserved
//  COMPANY URL:     https://www.douhub.com/
//  CONTACT:         developer@douhub.com
//
//  This source is subject to the DouHub License Agreements.
//
//  Our EULAs define the terms of use and license for each DouHub product.
//  Whenever you install a DouHub product or research DouHub source code file, you will be prompted to review and accept the terms of our EULA.
//  If you decline the terms of the EULA, the installation should be aborted and you should remove any and all copies of our products and source code from your computer.
//  If you accept the terms of our EULA, you must abide by all its terms as long as our technologies are being employed within your organization and within your applications.
//
//  THIS CODE AND INFORMATION IS PROVIDED "AS IS" WITHOUT WARRANTY
//  OF ANY KIND, EITHER EXPRESSED OR IMPLIED, INCLUDING BUT NOT
//  LIMITED TO THE IMPLIED WARRANTIES OF MERCHANTABILITY AND
//  FITNESS FOR A PARTICULAR PURPOSE.
//
//  ALL OTHER RIGHTS RESERVED

import React, { useEffect, useState } from 'react';
import { isFunction } from 'lodash';
import { utcISOString, isNonEmptyString } from 'douhub-helper-util';
import moment from 'moment';
import { LabelField, TimePicker, DatePicker, NoteField } from '../index';
import { CSS } from 'douhub-ui-web-basic';


const DATETIME_FIELD_CSS = `
    .field-datetime 
    {
        min-height: 30px;
        margin-bottom: 1rem;
    }

    .field-datetime input
    {
        font-size: 0.9rem;
        padding-top: 5px;
        padding-bottom: 5px;
    }

    .field-datetime .ant-picker-focused
    {
        border: none !important;
        box-shadow: none !important;
        outline: none !important;
    }

`;


const styles = {
    date: { minWidth: 150, flex: 1, border: 'none', padding: 0 },
    time: { minWidth: 150, flex: 1, border: 'none', padding: 0 }
}


const DateTimeField = (props: Record<string, any>) => {

    const { label, disabled, format, wrapperStyle, note, 
        placeholderForDate, placeholderForTime,
        labelStyle, alwaysShowLabel, defaultValue } = props;

    const showDatePicker = format != 'time';
    const showTimePicker = format != 'date';
    const [value, setValue] = useState(props.value);
    const hideLabel = props.hideLabel || !isNonEmptyString(label);
    const placeholder = isNonEmptyString(props.placeholder)?props.placeholder:'';

    useEffect(() => {
        setValue(props.value);
    }, [props.value])

    const dateValue = value ? moment(new Date(value)).format('YYYY-MM-DD') : null;
    const timeValue = value ? moment(new Date(value)).format('HH:mm:ss') : null;

    let timeFormat = props.timeFormat ? props.timeFormat : 'HH:mm';
    let dateFormat = props.dateFormat ? props.dateFormat : 'YYYY-MM-DD';

    let defaultTimeValue: any = null;
    let defaultDateValue: any = null;

    switch (defaultValue) {
        case 'now': {
            defaultTimeValue = moment(new Date(), timeFormat);
            defaultDateValue = moment(new Date(), dateFormat);
            break;
        }
    }

    const onChangeDate = (d: any, ds: string) => {

        let newValue = null;
        if (d) {
            let t = timeValue;
            if (!t) t = moment(d).format('HH:mm:ss');
            newValue = new Date(`${ds} ${t}`);
        }

        setValue(newValue);
        if (isFunction(props.onChange)) props.onChange(newValue ? utcISOString(newValue) : null);
    }

    const onChangeTime = (t: any, ts: string) => {
        let newValue = null;
        if (t) {
            let d = dateValue;
            if (!d) d = moment(t).format('YYYY-MM-DD');
            newValue = new Date(`${d} ${ts}`);
            setValue(newValue);
        }
        if (isFunction(props.onChange)) props.onChange(newValue ? utcISOString(newValue) : null);
    }

    return (
        <div className={`field field-datetime w-full ${isNonEmptyString(note) ? 'field-note-true' : ''}`}
            style={{flexDirection: 'column', ... wrapperStyle}}>
            <CSS id='field-datetime-css' content={DATETIME_FIELD_CSS} />
            <LabelField text={label} disabled={disabled} style={labelStyle}
                hidden={!(!hideLabel && (alwaysShowLabel || isNonEmptyString(value)))}
            />
            <div className="w-full flex flex-col">
                <div className="w-full flex">
                    {showDatePicker && <DatePicker
                        style={{ ...styles.date, ... (showTimePicker ? { marginRight: 20 } : {}) }}
                        value={dateValue ? moment(dateValue, dateFormat) : null}
                        onChange={onChangeDate}
                        defaultValue={defaultDateValue}
                        placeholder={showTimePicker && isNonEmptyString(placeholderForDate)?placeholderForDate:placeholder}
                        disabled={disabled}
                        format={dateFormat}
                    />}
                    {showTimePicker && <TimePicker style={{ ...styles.time, ...(showDatePicker ? { maxWidth: 100, minWidth: 100, width: 100 } : {}) }}
                        value={timeValue ? moment(timeValue, timeFormat) : null} onChange={onChangeTime}
                        defaultValue={defaultTimeValue}
                        placeholder={showDatePicker && isNonEmptyString(placeholderForTime)?placeholderForTime:placeholder}
                        disabled={disabled}
                        format={timeFormat} />}
                </div>
                <NoteField text={note} />
            </div>
        </div>
    )
}

export default DateTimeField