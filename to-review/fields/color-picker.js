import { useState, useEffect } from 'react';
import { isValidHex, isValidRGB } from '../../../shared/util/colors';
import FieldColorPickerCSS from './color-picker-css';
import _ from '../../../shared/util/base';
import Label from './label';
import Error from './error';
import Note from './note';
import dynamic from 'next/dynamic';
import { logDynamic } from '../controls/base';
import { ReactSVG } from 'react-svg';

const DISPLAY_NAME = 'FieldColorPicker';
let Slider = null;
let Input = null;
let Popconfirm = null;

const ColorPicker = (props) => {

    const colors = [
        { r: 0, g: 0, b: 0, a: 1 },
        { r: 184, g: 0, b: 0, a: 1 },
        { r: 219, g: 62, b: 0, a: 1 },
        { r: 252, g: 203, b: 0, a: 1 },
        { r: 0, g: 139, b: 2, a: 1 },
        { r: 0, g: 107, b: 181, a: 1 },
        { r: 18, g: 115, b: 222, a: 1 },
        { r: 0, g: 77, b: 207, a: 1 },
        { r: 83, g: 0, b: 235, a: 1 },
        { r: 255, g: 255, b: 255, a: 1 },
    ]
    const [color, setColor] = useState(props.color ? props.color : { r: 255, g: 0, b: 0, a: 1 });

    useEffect(() => {
        setColor(color);
    }, [props.color])

    const onChangeColor = (selColor) => {
        const newColor = _.cloneDeep(selColor);
        newColor.a = color.a;
        setColor(newColor);
        if (_.isFunction(props.onChange)) props.onChange(newColor)
    }

    const renderPicker = () => {
        return <div className="colors">
            {_.map(colors, (color) => {
                const value = `rgba(${color.r},${color.g},${color.b},${color.a})`;
                return <div className="color" key={value} style={{ backgroundColor: value }}
                    onClick={() => onChangeColor(color)}></div>
            })}
        </div>
    }

    const onChangeAlpha = (newAlpha) => {
        const newValue = _.cloneDeep(color);
        newValue.a = newAlpha;
        setColor(newValue);
        if (_.isFunction(props.onChange)) props.onChange(newValue)
    }

    const renderNumber = () => {
        const c = `rgba(${color.r},${color.g},${color.b},${color.a})`;
        return <div className="display">
            <div className="demo" style={{ backgroundColor: c }}></div>
            <div className="value">{c}</div>
        </div>
    }

    const renderSlider = () => {

        if (!Slider) Slider = logDynamic(dynamic(() => import('../controls/antd/slider'), { ssr: false }), '../controls/antd/slider', DISPLAY_NAME);
        return <Slider
            onChange={onChangeAlpha}
            min={0}
            max={1}
            step={0.05}
            value={color.a}
        />
    }

    return <div className="field-color-picker-popover">
        {renderNumber()}
        {renderPicker()}
        {renderSlider()}
    </div>
}
ColorPicker.displayName = 'ColorPicker';


const FieldColorPicker = (props) => {

    const { label, disabled, note, labelStyle, alwaysShowLabel } = props;

    const defaultValue = _.isNonEmptyString(props.defaultValue) ? props.defaultValue : null;
    const placeholder = _.isNonEmptyString(props.placeholder) ? props.placeholder : '';
    const [value, setValue] = useState(_.isNonEmptyString(props.value) ? props.value : defaultValue);
    const [pickerValue, setPickerValue] = useState(value);
    const [error, setError] = useState(null);

    useEffect(() => {
        const newValue = _.isNonEmptyString(props.value) ? props.value : defaultValue;
        setValue(newValue);
    }, [props.value, defaultValue]);

    const onChangePicker = (color) => {
        setPickerValue(`rgba(${color.r},${color.g},${color.b},${color.a})`);
    }

    const onChange = (newValue) => {

        if (_.isNonEmptyString(newValue) && !isValidRGB(newValue) && !isValidHex(newValue)) {
            setError('Please try to use a valid HEX or RGB(A) color. E.g. #FF000 or rgba(255,0,0,1)');
        }
        else {
            setError(null);
        }
        setValue(newValue);
        setPickerValue(newValue);
        if (_.isFunction(props.onChange)) props.onChange(newValue);
    }

    const onConfirmPicker = () => {
        onChange(pickerValue);
    }

    const onCancelPicker = () => {

    }

    const renderInputControl = () => {
        if (!Input) Input = logDynamic(dynamic(() => import('../controls/antd/input'), { ssr: false }), '../controls/antd/input', DISPLAY_NAME);
        return <Input
            disabled={disabled}
            className="field-text"
            defaultValue={defaultValue}
            placeholder={placeholder}
            onChange={(e) => onChange(e.target.value)}
            value={_.isNonEmptyString(value) ? value : ''}
        />
    }

    const renderColorButton = () => {
        if (!Popconfirm) Popconfirm = logDynamic(dynamic(() => import('../controls/antd/popconfirm'), { ssr: false }), '../controls/antd/popconfirm', DISPLAY_NAME);
        return <Popconfirm
            placement="topRight"
            title={<ColorPicker onChange={onChangePicker} />}
            icon={<></>}
            onCancel={onCancelPicker}
            onConfirm={onConfirmPicker}
            okText="Select"
            cancelText="Cancel">
            <ReactSVG src="/icons/color-palette.svg" className="color-palette-button" />
        </Popconfirm>
    }

    return (
        <>
            <FieldColorPickerCSS />
            <Label
                text={label}
                disabled={disabled}
                style={labelStyle}
                hidden={!(alwaysShowLabel || _.isObject(value) || !_.isNonEmptyString(placeholder))}
            />
            <Error text={error} />

            <div className="field field-color-picker">
                <div className="current" style={{ backgroundColor: value }}></div>
                {renderInputControl()}
                {renderColorButton()}
            </div>

            <Note text={note} />
        </>
    )
}

FieldColorPicker.displayName = DISPLAY_NAME;
export default FieldColorPicker;
