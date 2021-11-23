
const FieldColorPickerCSS = () => <style global jsx>
{`
    .field-color-picker
    {
        position: relative;
        flex-direction: column;
        height: 31px;
        overflow: hidden;
    }


    .field-color-picker-popover 
    {
        display: flex;
        flex-direction: column;
        width: 162px !important;
    }

    .field-color-picker-popover .colors
    {
        width: 100%;
    }

    .field-color-picker-popover .colors .color
    {
        float: left;
        width: 25px;
        height: 25px;
        margin-right: 2px;
        margin-bottom: 2px;
        cursor: pointer;
    }

    .field-color-picker-popover .display
    {
        display: flex;
        flex-direction: row;
        margin-bottom: 0.5rem;
    }

    .field-color-picker-popover .display .demo
    {
        width: 25px;
        height: 25px;
        margin-right: 10px;
    }

    .field-color-picker-popover .display .value
    {
        font-size: 0.7rem;
        line-height: 1;
        flex: 1;
        align-self: center;
    }

    .field-color-picker
    {
        display: flex;
        flex-direction: row;
    }

    .field-color-picker input
    {
        border-radius: 0;
        border: none !important;
    }

    .field-color-picker .current
    {
        height: 22px;
        width: 22px;
        align-self: center;
        margin-right: 10px;
    }

    .field-color-picker .color-palette-button,
    .field-color-picker .color-palette-button svg,
    .field-color-picker .color-palette-button div
    {
       height: 20px;
       width: 20px;
       align-self: center;
       cursor: pointer;
    }
`}</style>


FieldColorPickerCSS.displayName = 'FieldColorPickerCSS';
export default FieldColorPickerCSS;
