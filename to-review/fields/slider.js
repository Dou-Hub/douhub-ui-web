import React, { useEffect, useState } from 'react';
import _ from '../../../shared/util/base';
import Label from './label';
import Note from './note';
import dynamic from 'next/dynamic';
import { logDynamic } from '../controls/base';

const DISPLAY_NAME = 'FieldSlider';

const FieldSliderCSS = () => <style global jsx>
{`
    .field-slider 
    {
        min-height: 31px;
    }

    .field-slider .ant-slider 
    {
        width: 100%;
        margin: 8px 0;
    }

    .field-slider  .number
    {
        font-size: 0.8rem;
        width: 3rem;
        align-self: center;
    }
`}
</style>
FieldSliderCSS.displayName = 'FieldSliderCSS';

let Slider = null;

const FieldSlider = React.forwardRef((props, ref) => {

    const { label, disabled, note, labelStyle, inputStyle, alwaysShowLabel, hideNumber } = props;

    const defaultValue = _.isNumber(props.defaultValue) ? props.defaultValue : null;
    const placeholder = _.isNonEmptyString(props.placeholder) ? props.placeholder : '';
    const [value, setValue] = useState(_.isNumber(props.value) ? props.value : defaultValue);
    const min = _.isNumber(props.min) ? props.min :0;
    const max = _.isNumber(props.max) ? props.max :100;
    const step = _.isNumber(props.step) ? props.step :5;
    const type = _.isNonEmptyString(props.type) ? props.type : 'percentage';
    const className = _.isNonEmptyString(props.className) ? props.className : '';

    useEffect(() => {
        const newValue = _.isNumber(props.value) ? props.value : defaultValue;
        setValue(newValue);
    }, [props.value, defaultValue]);

    const onChange = (newValue) => {
        setValue(newValue);
        if (_.isFunction(props.onChange)) props.onChange(newValue);
    }

    const renderNumber = (e) => {
        if (hideNumber) return null;
        let number = value;
        switch(type)
        {
            case 'percentage': 
            {
                number = `${value} %`;
                break;
            }
        }
        return <div className="number">{number}</div>
    }

    const renderInput = () => {

        if (!Slider) Slider = logDynamic(dynamic(() => import('../controls/antd/slider'), { ssr: false }), '../controls/antd/slider', DISPLAY_NAME);
        return <>
            {renderNumber()}
            <Slider
            ref={ref}
            style={inputStyle}
            disabled={disabled}
            defaultValue={defaultValue}
            onChange={onChange}
            min={min}
            max={max}
            step={step}
            value={value}
        />
        </>
    }
    return <>
        <FieldSliderCSS/>
        <Label text={label} disabled={disabled} style={labelStyle} 
        hidden={!(alwaysShowLabel || _.isNumber(value) || !_.isNonEmptyString(placeholder))}
        />
        <div className={`field field-slider ${className} ${disabled ? 'field-disabled' : ''} ${_.isNonEmptyString(note) ? 'field-note-true' : ''}`}>
            {renderInput()}
        </div>
        <Note text={note} />
    </>
});

FieldSlider.displayName = DISPLAY_NAME;
export default FieldSlider;
