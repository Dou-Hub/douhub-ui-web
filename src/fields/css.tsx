console.log('Load FieldCSS');
export const FIELD_CSS = `
    .field
    {
        display: flex;
        flex-direction: row;
        font-size: 1rem;
        border-top: none !important;
        border-right: none !important;
        border-left: none !important;
        border-bottom: dashed 1px #cccccc;
        outline: none !important;
        box-shadow: none !important;
        margin-bottom: 1rem;
        width: 100%;
    }

    .field.has-wrapper
    {
        border-bottom: none !important;
        margin-bottom: 0 !important;
    }

    .field.hide-bottom-border
    {
        border-bottom: none !important;
    }

    .field input
    {
        outline: none !important;
        box-shadow: none !important;
    }

    .field-error
    {
        font-size: 0.8rem !important;
        color: red !important;
        line-height: 1.1 !important;
        margin-bottom: 0 !important;
    } 

    .field-note-true {
        border-bottom: none !important;
        margin-bottom: 0 !important;
    }

    .field-note
    {
        font-size: 0.8rem !important;
        color: #999999 !important;
        line-height: 1.1 !important;
        border-bottom: dashed 1px #cccccc !important;
        padding-bottom: 5px;
        margin-bottom: 1rem !important;
        font-style: italic !important;
        text-align: left;
    } 

    .field-note-error
    {
        color: red !important;
    }

    .field-recaptcha {
        border-bottom: none !important;
    }

    .field-doing 
    {
        border-bottom: none !important;
    }

    .field-message 
    {
        border-bottom: none !important;
        font-size: 0.9rem;
        line-height: 1.33;
    }

    .field-message-error 
    {
        color: #dc3545;
    }

    .field-message-info 
    {
        color: #3298dc;
    }

    .field-message-success 
    {
        color: #28a745;
    }

    .field-message-warning 
    {
        color: #ffc107;
    }

    .field-message-primary 
    {
        color: #007bff;
    }

    .field-message-secondary 
    {
        color: #6c757d;
    }

    .field-message-secondary 
    {
        color: #6c757d;
    }

    .field-doing div
    {
        font-size: 1rem !important;
    } 

`
