
export const CHECKBOX_FIELD_CSS = `
    .field-checkbox
    {
        border-bottom: none !important;
        display: flex;
        flex-direction: row;
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
        min-width: 30px;
    }

    .field-checkbox.small .checkbox 
    {
        height: 16px;
        width: 16px;
        min-width: 16px;
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
        text-align: left;
    }

    .field-checkbox.small .text .label
    {
        font-size: 0.7rem;
        text-align: left;
    }

    .field-checkbox .text .sub-label
    {
        font-size: 0.75rem;
        color: #666666;
        line-height: 1.1;
        text-align: left;
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

    .field-checkbox-selected-true .checkmark svg,
    .field-checkbox-selected-true .checkmark svg path
    {
        fill: #333333 !important;
    }

    .field-checkbox.field-disabled .checkbox
    {
        cursor: not-allowed;
    }
`;
