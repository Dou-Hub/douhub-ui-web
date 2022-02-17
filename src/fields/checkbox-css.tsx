
export const CHECKBOX_FIELD_CSS = `
    .field-checkbox
    {
        border-bottom: none !important;
    }

    .field-checkbox.field-note-true
    {
        margin-bottom: 1rem !important;
    }

    .field-checkbox .checkbox 
    {
        border: solid 1px #cccccc;
        margin-right: 10px;
        height: 30px;
        width: 30px;
        display: flex;
        cursor: pointer;
    }

    .field-checkbox.small .checkbox 
    {
        height: 16px;
        width: 16px;
    }

    .field-checkbox.field-disabled .checkbox 
    {
        border: solid 1px rgba(0,0,0,0.3);
    }

    .field-checkbox .checkmark 
    {
        height: 28px;
        width: 28px;
    }

    .field-checkbox .checkmark.small
    {
        height: 14px;
        width: 14px;
    }
    

    .field-checkbox .text 
    {
        align-self: center;
        position: relative;
    }

    .field-checkbox .text.info-true
    {
        padding-right: 20px;
    }

    .field-checkbox .text .info
    {
        position: absolute;
        right: 0;
        top: -8px;
        width: 16px;
        height: 16px;
        cursor: pointer;
    }

    .field-checkbox .text .info svg
    {
        fill: #0288d1;
    }

    .field-checkbox .text p
    {
        margin-bottom: 0;
    }

    .field-checkbox .text .label
    {
        font-size: 0.9rem;
    }

    .field-checkbox.small .text .label
    {
        font-size: 0.7rem;
    }

    .field-checkbox .text .sub-label
    {
        font-size: 0.75rem;
        color: #666666;
        line-height: 1.1;
    }

    .field-checkbox.small .text .sub-label
    {
        font-size: 0.55rem;
    }

    .field-checkbox .checkmark svg 
    {
        width: 22px !important;
        height: 22px !important;
        margin: 3px;
        fill: #ffffff;
    }

    .field-checkbox.small .checkmark svg 
    {
        width: 12px !important;
        height: 12px !important;
        margin: 1px;
    }

    .field-checkbox-selected-false .checkmark
    {
        display:none;
    }

    .field-checkbox-selected-true .checkmark svg 
    {
        fill: #333333;
    }

    .field-checkbox-selected-true.field-disabled .checkmark svg 
    {
        fill: rgba(0,0,0,0.3);
    }

    .field-checkbox.field-disabled .checkbox
    {
        cursor: not-allowed;

    }
`;
